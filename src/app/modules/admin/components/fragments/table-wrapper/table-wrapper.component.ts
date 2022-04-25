import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { ApiResponsePayload } from '../../../../../core/interfaces/api/api-response.payload';
import { MessageSeverity } from '../../../../../core/interfaces/types/message-severity.type';
import { DayJsService } from '../../../../../core/services/dayjs/dayjs.service';
import { UtilsService } from '../../../../../shared';
import { FormField } from '../form-wrapper/interfaces/form-field.interface';
import { MultiSelectWrapperOptions } from '../multi-select-wrapper/interfaces/multi-select-wrapper-options.interfaces';
import { SEVERITY_MESSAGE_SUMMARY } from './constants/common.constant';
import { ERROR_MESSAGES } from './constants/error-messages.constant';
import { DataConverter } from './interfaces/data-converter.interface';
import { TableColumn } from './interfaces/table-column.interface';
import { FormatValueDisplayPipe } from './pipes/format-value-display.pipe';
import { CrudService } from './services/crud/crud.service';
import { FormWrapperService } from './services/form/form-wrapper.service';

const addOrUpdate = 'add-or-update';
const rowToDeleteClass = 'table-wrapper-row-to-delete';
const serverErrorMessage = 'Erreur serveur !';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  providers: [MessageService, ConfirmationService, CrudService],
})
export class TableWrapperComponent implements OnInit, OnChanges {
  @ViewChild('filterGlobalInput', { static: false }) filterGlobalInput: InputText | undefined;

  @Input() columnList: TableColumn[] = [];

  @Input() scrollHeight = '80vh';

  @Input() rowsReorderable = false;

  @Input() crudEndPoint = '';

  @Input() exportCsvFileName: string | undefined;

  @Input() formFields: FormField[] | undefined;

  @Input() dataGeneratorList?: DataConverter[];

  @Output() tableDataChange = new EventEmitter<any[]>();

  public isLoading = true;

  public globalFilterFields: string[] = [];

  public sortMode: 'single' | 'multiple' = 'single';

  public sortField = '';

  public sortOrder = 1;

  public showFormDialog = false;

  public formValues: any = {};

  public selectedTableData: any[] = [];

  public changedData: any[] = [];

  public tableData: any[] = [];

  private originalData: any[] = [];

  public hasExportableData: boolean | undefined;

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly formWrapperService: FormWrapperService,
    private readonly crudService: CrudService,
  ) {
  }

  private static applyDataGenerator(dataGenerator: DataConverter, data: { [p: string]: any }): { [p: string]: any } {
    const [dataKey] = Object.keys(dataGenerator);
    return {
      ...data,
      [dataKey]: dataGenerator[dataKey]({ ...data }),
    };
  }

  async ngOnInit(): Promise<void> {
    if (this.crudEndPoint) {
      try {
        this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
        this.originalData = this.tableData.map((value: any) => ({ ...value }));

        if (this.tableData.length > 0) {
          this.hasExportableData = this.columnList.filter((col) => col.exportable).length > 0;

          this.columnList.forEach((column) => {
            this.initializeDefaultSortField(column);
            this.initializeGlobalFilter(column);
            this.initializePickList(column);
          });
        }

      } catch (e: any) {
        if (e.name !== 'EmptyError') {
          console.debug(e);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data'] && changes['data'].currentValue && changes['data'].currentValue.length) {
      this.tableData = this.originalData.map((value: any) => ({ ...value }));
      this.hasExportableData = this.columnList.filter((data) => data.exportable).length > 0;
    }
  }

  /**
   * onCloseDialog
   */
  public onDialogCloseAction(): void {
    this.formValues = {};
    this.showFormDialog = false;
  }

  /**
   * onOpenDialog
   */
  public async onOpenDialog(rowData?: { [key: string]: any; }): Promise<void> {
    if (!this.formFields) {
      throw new Error(ERROR_MESSAGES.invalidFormFields);
    }

    const listToLoad: Promise<void>[] = [];
    this.addToMultiSelectListToLoad(this.formFields, listToLoad);

    await Promise.all(listToLoad);

    this.formValues = rowData || {};
    this.showFormDialog = true;
  }

  /**
   * onDuplicateRow
   * @param rowData
   * @param rowIndex
   * @param wrappedTable
   */
  public onDuplicateRow(rowData: { [key: string]: any; }, rowIndex: number, wrappedTable: Table): void {
    const { id, position, ...newRow } = rowData;
    const newItem: { [key: string]: any; } = { ...newRow, id: 'duplicatedAt' + DayJsService.getDate(undefined) };
    const newItemIndex = rowIndex + 1;

    this.tableData.splice(newItemIndex, 0, newItem);

    if (position !== undefined) {
      this.tableData = this.tableData.map((eachData: { [key: string]: any; }, i: number) => {
        if (i < newItemIndex) {
          return eachData;
        }

        if (i === newItemIndex) {
          newItem['position'] = i;
        }

        return { ...eachData, position: i };
      });
    }

    wrappedTable.value = this.tableData;

    this.updateList(newItem, addOrUpdate, 'changedData');
  }

  /**
   * onFormValueChange
   * @param formValues
   */
  public onFormValueChange(formValues: any): void {
    this.formValues = formValues;
    console.debug('onFormValueChange:', this.formValues);
  }

  /**
   * onSaveDialogData
   */
  public async onDialogSaveAction(): Promise<void> {
    if (!this.formFields) {
      throw new Error(ERROR_MESSAGES.invalidFormFields);
    }

    const editMode = !!this.formValues.id;

    try {
      this.isLoading = true;

      let data = this.formWrapperService.convertFormValues(this.formFields, this.formValues);

      if (this.dataGeneratorList && this.dataGeneratorList.length) {
        this.dataGeneratorList.forEach((dataGenerator) => {
          data = TableWrapperComponent.applyDataGenerator(dataGenerator, { ...data });
        });
      }
      console.debug('onDialogSaveAction:', data);

      const response: any = editMode
        ? await lastValueFrom(this.crudService.put<any>(this.crudEndPoint, { data }))
        : await lastValueFrom(this.crudService.post<any>(this.crudEndPoint, { data }));

      if (!response || !response.id) {
        console.debug('onSaveDialogData response:', response);
        this.displayMessage(response?.message || ERROR_MESSAGES.server, 'error');
        return;
      }

      this.updateList(this.formValues, 'remove', 'changedData');
      this.onDialogCloseAction();

      this.displayMessage(
        editMode ? 'Elément bien mis à jour !' : 'Elément créé avec succès !', 'success',
      );

      this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
      this.originalData = this.tableData.map((value: any) => ({ ...value }));

    } catch (e: any) {
      console.debug(e);
      this.displayMessage(
        editMode ? 'Elément non mis à jour !' : 'Elément non créé !', 'error',
      );

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * onDeleteRow
   * @param elementId
   * @param rowElement
   */
  public onDeleteRow(elementId: string, rowElement: HTMLTableRowElement): void {
    rowElement.classList.add(rowToDeleteClass);

    this.confirmationService.confirm({
      message: 'Supprimer cet élément ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      reject: () => {
        rowElement.classList.remove(rowToDeleteClass);
      },
      accept: async () => {
        this.selectedTableData = [];

        try {
          this.isLoading = true;
          const response: ApiResponsePayload = await lastValueFrom(
            this.crudService.delete<any>(this.crudEndPoint, { id: elementId }),
          );

          if (!response || response.message !== 'SUCCESS') {
            console.debug('deleteRow response', response);
            this.displayMessage(
              response?.details || serverErrorMessage, 'error',
            );
            return;
          }

          this.updateList({ id: elementId }, 'remove', 'changedData');
          this.updateList({ id: elementId }, 'remove', 'tableData');

          this.displayMessage('Elément bien supprimé !', 'success');

          rowElement.parentElement?.removeChild(rowElement);

        } catch (e: any) {
          console.debug(e);
          this.displayMessage('Elément non supprimé !', 'error');

        } finally {
          this.isLoading = false;
          rowElement.classList.remove(rowToDeleteClass);
        }
      },
    });
  }

  /**
   * onDeleteSelectedRows
   */
  public onDeleteSelectedRows(): void {
    this.confirmationService.confirm({
      message: `Supprimer les ${this.selectedTableData.length} éléments sélectionnés ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const idList: string[] = this.selectedTableData.map((element) => element.id);

        try {
          this.isLoading = true;
          const response: ApiResponsePayload = await lastValueFrom(
            this.crudService.delete<any>(this.crudEndPoint, { idList }),
          );

          if (!response || response.message !== 'SUCCESS') {
            console.debug('deleteSelectedRows response', response);
            this.displayMessage(
              response?.details || serverErrorMessage, 'error',
            );
            return;
          }

          this.displayMessage('Eléments supprimés avec succès !', 'success');

          this.changedData = [];
          this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
          this.originalData = this.tableData.map((value: any) => ({ ...value }));

        } catch (e: any) {
          console.debug(e);
          this.displayMessage('Eléments non supprimés !', 'error');

        } finally {
          this.isLoading = false;
        }
      },
    });
  }

  /**
   * onRowsReorder
   */
  public onRowsReorder({ dragIndex, dropIndex }: { dragIndex: number; dropIndex: number; }, wrappedTable: Table): void {
    const draggedElement = wrappedTable.value[dropIndex];

    this.tableData = this.tableData.map((data, i) => {
      const elementToUpdate: any = {};

      if (data.id === draggedElement.id) {
        elementToUpdate['position'] = dropIndex;

      } else if (dragIndex > dropIndex && i < dragIndex && i >= dropIndex) {
        elementToUpdate['position'] = i + 1;

      } else if (dragIndex < dropIndex && i > dragIndex && i <= dropIndex) {
        elementToUpdate['position'] = i - 1;

      } else if (!data.position) {
        elementToUpdate['position'] = i;

      } else {
        return data;
      }

      elementToUpdate['id'] = data.id;
      this.updateList(elementToUpdate, addOrUpdate, 'changedData');
      return Object.assign({}, data, elementToUpdate);
    });

    wrappedTable.value = this.tableData;
  }

  /**
   * onCellValueChange
   * @param elementId
   * @param col
   * @param value
   */
  public onCellValueChange(elementId: string, col: TableColumn, value: any): void {
    let dataToCompare = this.originalData.find((element: any) => element.id === elementId);
    if (!dataToCompare) {
      dataToCompare = this.changedData.find((element: any) => element.id === elementId);
    }

    if (!dataToCompare) {
      throw new Error('No data found to compare!');
    }

    const dataToUpdate: { [key: string]: any; } = { id: elementId };
    if (
      (
        col.inputType === 'number'
        || (dataToCompare[col.field] && typeof dataToCompare[col.field] === 'number')
      ) && dataToCompare[col.field] !== +value
    ) {
      dataToUpdate[col.field] = +value;

    } else if (dataToCompare[col.field] !== value) {
      dataToUpdate[col.field] = value;
    }

    if (Object.keys(dataToUpdate).length > 1) {
      this.updateList(dataToUpdate, addOrUpdate, 'changedData');
    }
  }

  /**
   * onOpenPickListOverlayPanel
   * @param op
   * @param col
   * @param e
   */
  public async onOpenPickListOverlayPanel(op: OverlayPanel, col: TableColumn, e: MouseEvent): Promise<void> {
    if (!col || !col.pickListWrapperOptions) {
      this.displayMessage(
        'Impossible d\'éditer ce champ, les options de configuration sont invalides.', 'error',
      );
      return;
    }

    if (
      (!col.pickListWrapperOptions.sourceList || !col.pickListWrapperOptions.sourceList.length)
      && !col.pickListWrapperOptions.sourceListEndPoint
    ) {
      this.displayMessage(
        'Impossible d\'éditer ce champ, les données sources sont invalides.', 'error',
      );
      return;
    }

    if (!col.pickListWrapperOptions.sourceList?.length) {
      col.pickListWrapperOptions.sourceList = await this.loadData(
        col.pickListWrapperOptions.sourceListEndPoint as string, [],
      );

      if (!col.pickListWrapperOptions.sourceList || !!col.pickListWrapperOptions.sourceList) {
        this.displayMessage(
          'Impossible d\'éditer ce champ, les données sources n\'ont pu être récupérées.', 'error',
        );
        return;
      }
    }

    op.toggle(e);
  }

  /**
   * onClosePickListOverlayPanel
   * @param op
   * @param rowData
   * @param col
   * @param value
   */
  public onClosePickListOverlayPanel(op: OverlayPanel, rowData: any, col: TableColumn, value?: any[]): void {
    op.hide();

    if (!value || !col.pickListWrapperOptions) {
      return;
    }

    rowData[col.field] = value;

    const originalValue: any[] = this.originalData.find((element) => element.id === rowData.id)[col.field];
    const propertyToDisplay = col.pickListWrapperOptions.propertyToDisplay;
    const comparableOriginalValue = UtilsService.convertSortedStringListToString(
      originalValue.map((v) => propertyToDisplay ? v[propertyToDisplay] : v),
    );
    const comparableValue = UtilsService.convertSortedStringListToString(
      value.map((v) => propertyToDisplay ? v[propertyToDisplay] : v),
    );

    const dataToUpdate: { [key: string]: any; } = { id: rowData.id };
    if (comparableOriginalValue !== comparableValue) {
      dataToUpdate[col.field] = value;
    }

    if (Object.keys(dataToUpdate).length > 1) {
      this.updateList(dataToUpdate, addOrUpdate, 'changedData');
    }
  }

  /**
   * onOpenFormOverlayPanel
   * @param op
   * @param col
   * @param e
   */
  public onOpenFormOverlayPanel(op: OverlayPanel, col: TableColumn, e: MouseEvent): void {
    if (!col || !col.formFields) {
      this.displayMessage(
        'Impossible d\'éditer ce champ, les options de configuration sont invalides.', 'error',
      );
      return;
    }

    op.toggle(e);
  }

  /**
   * onCloseFormOverlayPanel
   * @param op
   * @param rowData
   * @param col
   * @param values
   */
  public onCloseFormOverlayPanel(op: OverlayPanel, rowData: any, col: TableColumn, values?: any): void {
    op.hide();

    if (!values || !col.formFields) {
      return;
    }

    const convertedValues = this.formWrapperService.convertFormValues(col.formFields, values);
    rowData[col.field] = convertedValues;

    const dataToUpdate: { [key: string]: any; } = {
      id: rowData.id,
      [col.field]: convertedValues,
    };

    this.updateList(dataToUpdate, addOrUpdate, 'changedData');
  }

  /**
   * onSaveChangedData
   */
  public async onSaveChangedData(): Promise<void> {
    if (this.changedData.length === 0) {
      return;
    }

    try {
      this.isLoading = true;

      const data: any[] = this.changedData.map((eachData: { [p: string]: any }) => {
        let generated = { ...eachData };
        if (this.dataGeneratorList && this.dataGeneratorList.length) {
          this.dataGeneratorList.forEach((dataGenerator) => {
            generated = TableWrapperComponent.applyDataGenerator(dataGenerator, { ...generated });
          });
        }
        return { ...eachData, ...generated };
      });

      const response: any = await lastValueFrom(this.crudService.put<any[]>(
        this.crudEndPoint + '/many',
        {
          data,
        },
      ));

      if (!response || !Array.isArray(response) || response.length === 0) {
        console.debug('onSaveDialogData response:', response);
        this.displayMessage(response?.message || serverErrorMessage, 'error');
        return;
      }

      const isPartialUpdate = (response.filter((updated) => updated && updated.id).length) < this.changedData.length;

      this.displayMessage(
        isPartialUpdate ? 'Certains éléments n\'ont pu être traités...' : 'Eléments traités avec succès !',
        isPartialUpdate ? 'warn' : 'success',
      );

      this.changedData = [];
      this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
      this.originalData = this.tableData.map((value: any) => ({ ...value }));

    } catch (e: any) {
      console.debug(e);
      this.displayMessage('Eléments non traités !', 'error');

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * onExportSelectedData
   * @param table
   */
  public onExportSelectedData(table: Table): void {
    if (this.selectedTableData.length === 0) {
      this.displayMessage('Sélectionner les lignes à exporter.', 'warn');
      return;
    }

    if (this.exportCsvFileName && table.exportFilename !== this.exportCsvFileName) {
      table.exportFilename = this.exportCsvFileName;
    }

    const pipe = new FormatValueDisplayPipe();
    table.exportFunction = (col: { field: string; data: any; }) => {
      return pipe.transform(col.data, col.field, false);
    };

    table.columns = this.columnList.filter((col) => col.exportable);
    table.exportCSV({ selectionOnly: true });
    table.columns = this.columnList;

    this.displayMessage('Les lignes sélectionnées ont bien été exportées.', 'info');
  }

  /**
   * resetTableChanges
   */
  public resetTableChanges(): void {
    this.tableData = this.originalData.map((value: any) => ({ ...value }));
    this.changedData = [];
    this.emitChanges([]);
  }

  /**
   * initializeDefaultSortField
   * @param column
   * @private
   */
  private initializeDefaultSortField(column: TableColumn): void {
    if (column.sortField && !this.sortField) {
      this.sortField = column.field;
      this.sortOrder = column.sortOrder || 1;
      this.sortMode = column.sortMode || 'single';
    }
  }

  /**
   * initializeGlobalFilter
   * @param column
   * @private
   */
  private initializeGlobalFilter(column: TableColumn): void {
    if (column.globalFilterField) {
      this.globalFilterFields.push(column.field);
    }
  }

  /**
   * initializePickList
   * @param column
   * @private
   */
  private initializePickList(column: TableColumn): void {
    if (column.pickListWrapperOptions && column.pickListWrapperOptions.sourceListEndPoint) {
      const pickListWrapperOptions = column.pickListWrapperOptions;
      this.loadData<any[]>(column.pickListWrapperOptions.sourceListEndPoint, []).then((list) => {
        if (!list || list.length === 0) {
          return;
        }

        if (pickListWrapperOptions.sourceAdapter) {
          // @ts-ignore
          pickListWrapperOptions.sourceList = list.map((data) => pickListWrapperOptions.sourceAdapter(data));
        } else {
          pickListWrapperOptions.sourceList = list;
        }
      }).catch((error) => {
        console.debug(error);
      });
    }
  }

  private addToMultiSelectListToLoad(formFields: FormField[], listToLoad: Promise<void>[]): void {
    formFields.forEach((formField) => {
      if (formField.multiSelectWrapperOptions && formField.multiSelectWrapperOptions.sourceListEndPoint) {
        listToLoad.push(
          this.initializeMultiSelect(
            formField, formField.multiSelectWrapperOptions, formField.multiSelectWrapperOptions.sourceListEndPoint,
          ),
        );
      }

      if (formField.childFormFields) {
        this.addToMultiSelectListToLoad(formField.childFormFields, listToLoad);
      }
    });
  }

  private async initializeMultiSelect(
    formField: FormField, multiSelectWrapperOptions: MultiSelectWrapperOptions, sourceListEndPoint: string,
  ): Promise<void> {
    try {
      const list = await this.loadData<any[]>(sourceListEndPoint, []);
      if (!list || list.length === 0) {
        return;
      }

      multiSelectWrapperOptions.list = multiSelectWrapperOptions.sourceAdapter(list);
    } catch (error) {
      console.debug('initializeMultiSelect error:', { formField, error });
    }
  }

  /**
   * loadData
   * @param endPoint
   * @param defaultValue
   * @private
   */
  private loadData<T>(endPoint: string, defaultValue: any): Promise<any> {
    try {
      this.isLoading = true;
      return lastValueFrom(this.crudService.get<T>(endPoint));

    } catch (e: any) {
      console.debug(e);
      this.displayMessage('Les données n\'ont pas pu être récupérées !', 'error');
      return Promise.resolve(defaultValue);

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * updateList
   * @param data
   * @param action
   * @param list
   * @private
   */
  private updateList(data: any, action: 'add-or-update' | 'remove', list: 'tableData' | 'changedData'): void {
    const dataIndex = this[list].findIndex((element) => element.id === data.id);

    if (dataIndex !== -1) {
      if (action === addOrUpdate) {
        this[list][dataIndex] = { ...this[list][dataIndex], ...data };

      } else if (action === 'remove') {
        this[list].splice(dataIndex, 1);
      }

    } else if (action === addOrUpdate) {
      this[list].push({ ...data });
    }

    if (list === 'changedData') {
      this.emitChanges(this.changedData);
    }
  }

  /**
   * displayMessage
   * @param message
   * @param severity
   * @private
   */
  private displayMessage(message: string, severity: MessageSeverity): void {
    this.messageService.add({
      key: 'tableToast',
      severity,
      summary: SEVERITY_MESSAGE_SUMMARY[severity],
      detail: message,
      life: 3000,
    });
  }

  /**
   * emitChanges
   * @param changedData
   * @private
   */
  private emitChanges(changedData: any[]): void {
    if (!changedData) {
      return;
    }

    this.tableDataChange.emit([...changedData]);
  }
}
