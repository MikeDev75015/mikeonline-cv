import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { ApiResponsePayload } from '../../../../../core/interfaces/api/api-response.payload';
import { MessageSeverity } from '../../../../../core/interfaces/types/message-severity.type';
import { UtilsService } from '../../../../../shared';
import { FormFields } from '../form-wrapper/interfaces/form-fields.interface';
import { SEVERITY_MESSAGE_SUMMARY } from './constants/common.constant';
import { TableColumn } from './interfaces/table-column.interface';
import { FormatValueDisplayPipe } from './pipes/format-value-display.pipe';
import { CrudService } from './services/crud.service';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  providers: [MessageService, ConfirmationService, CrudService],
})
export class TableWrapperComponent implements OnInit, OnChanges {
  @ViewChild('filterGlobalInput', { static: false }) filterGlobalInput: InputText | undefined;

  @Input() columnList: TableColumn[] = [];

  @Input() rowsNumber: number | undefined;

  @Input() scrollHeight = '80vh';

  @Input() reorderableRows = false;

  @Input() crudEndPoint = '';

  @Input() exportCsvFileName: string | undefined;

  @Input() formFields: FormFields[] | undefined;

  @Input() dataAdapter?: (data: any) => any;

  @Input() dataGenerator?: (data: any) => any;

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
    private readonly crudService: CrudService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.crudEndPoint) {
      this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
      this.originalData = this.tableData.map((value: any) => ({ ...value }));

      if (this.tableData.length > 0) {
        this.hasExportableData = this.columnList.filter((col) => col.exportable).length > 0;

        this.columnList.forEach((column) => {
          this.initializeTableOptions(column);
        });
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
  public onCloseDialog(): void {
    this.showFormDialog = false;
    this.formValues = {};
  }

  /**
   * onOpenDialog
   */
  public onOpenDialog(): void {
    this.formValues = {};
    this.initializeFormWrapperValues();
    this.showFormDialog = true;
  }

  /**
   * onEditRow
   * @param rowData
   */
  public onEditRow(rowData: { [key: string]: any; }): void {
    this.formValues = { ...rowData };
    this.initializeFormWrapperValues({ ...rowData });
    this.showFormDialog = true;
  }

  /**
   * onFormValueChange
   * @param formValues
   */
  public onFormValueChange(formValues: any): void {
    this.formValues = formValues;
  }

  /**
   * onSaveDialogData
   */
  public async onSaveDialogData(): Promise<void> {
    try {
      this.isLoading = true;

      const data = this.dataAdapter ? this.dataAdapter(this.formValues) : this.formValues;

      const response: any = this.formValues.id
        ? await lastValueFrom(this.crudService.put<any>(this.crudEndPoint, { data }))
        : await lastValueFrom(this.crudService.post<any>(this.crudEndPoint, { data }));

      if (!response || !response.id) {
        console.debug('onSaveDialogData respone:', response);
        this.displayMessage(response?.message || 'Erreur serveur !', 'error');
        return;
      }

      this.updateList(this.formValues, 'remove', 'changedData');
      this.onCloseDialog();

      this.displayMessage(
        this.formValues.id ? 'Elément bien mis à jour !' : 'Elément créé avec succès !', 'success',
      );

      this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
      this.originalData = this.tableData.map((value: any) => ({ ...value }));

    } catch (e: any) {
      console.debug(e);
      this.displayMessage(
        this.formValues.id ? 'Elément non mis à jour !' : 'Elément non créé !', 'error',
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
    rowElement.classList.add('table-wrapper-row-to-delete');

    this.confirmationService.confirm({
      message: 'Supprimer cet élément ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      reject: () => {
        rowElement.classList.remove('table-wrapper-row-to-delete');
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
              response?.details || 'Erreur serveur !', 'error',
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
          rowElement.classList.remove('table-wrapper-row-to-delete');
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
              response?.details || 'Erreur serveur !', 'error',
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
  public onRowsReorder(): void {
    if (this.tableData[0].position !== undefined) {
      this.tableData.forEach((data, i) => {
        data.position = i;
        const originalData = this.originalData.find((element) => element.id === data.id);
        if (originalData.position !== data.position) {
          this.updateList(data, 'add-or-update', 'changedData');
        }
      });
    }
  }

  /**
   * onCellValueChange
   * @param elementId
   * @param col
   * @param value
   */
  public onCellValueChange(elementId: string, col: TableColumn, value: any): void {
    const originalData = this.originalData.find((element) => element.id === elementId);

    let dataToUpdate: { [key: string]: any; } = { id: elementId };
    if ((col.inputType === 'number' || typeof originalData[col.field] === 'number') && originalData[col.field] !== +value) {
      dataToUpdate[col.field] = +value;

    } else if (originalData[col.field] !== value) {
      dataToUpdate[col.field] = value;
    }

    if (Object.keys(dataToUpdate).length > 1) {
      this.updateList(dataToUpdate, 'add-or-update', 'changedData');
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

    let dataToUpdate: { [key: string]: any; } = { id: rowData.id };
    if (comparableOriginalValue !== comparableValue) {
      dataToUpdate[col.field] = value;
    }

    if (Object.keys(dataToUpdate).length > 1) {
      this.updateList(dataToUpdate, 'add-or-update', 'changedData');
    }
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

      let adaptedData: any[] = [];
      if (this.dataAdapter) {
        // @ts-ignore
        adaptedData = this.changedData.map((eachData) => this.dataAdapter(eachData));
      }

      const response: any = await lastValueFrom(this.crudService.put<any[]>(this.crudEndPoint + '/many', {
        data: adaptedData.length ? adaptedData : this.changedData,
      }));

      if (!response || !Array.isArray(response) || response.length === 0) {
        console.debug('onSaveDialogData response:', response);
        this.displayMessage(response?.message || 'Erreur serveur !', 'error');
        return;
      }

      const isPartialUpdate = response.filter((updated) => updated && updated.id).length < this.changedData.length;

      this.displayMessage(
        isPartialUpdate ? 'Certains éléments n\'ont pu être mis à jour...' : 'Eléments mis à jour avec succès !',
        isPartialUpdate ? 'warn' : 'success',
      );

      this.changedData = [];
      this.tableData = await this.loadData<any[]>(this.crudEndPoint, []);
      this.originalData = this.tableData.map((value: any) => ({ ...value }));

    } catch (e: any) {
      console.debug(e);
      this.displayMessage('Eléments non mis à jour !', 'error');

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
   * loadData
   * @param endPoint
   * @param defaultValue
   * @private
   */
  private loadData<T>(endPoint: string, defaultValue: T): Promise<T> {
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
   * initializeTableOptions
   * @param column
   * @private
   */
  private initializeTableOptions(column: TableColumn): void {
    this.initializeDefaultSortField(column);
    this.initializeGlobalFilter(column);
    this.initializePickList(column);
  }

  private initializeDefaultSortField(column: TableColumn): void {
    if (column.sortField && !this.sortField) {
      this.sortField = column.field;
      this.sortOrder = column.sortOrder || 1;
      this.sortMode = column.sortMode || 'single';
    }
  }

  private initializeGlobalFilter(column: TableColumn): void {
    if (column.globalFilterField) {
      this.globalFilterFields.push(column.field);
    }
  }

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
      });
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
      if (action === 'add-or-update') {
        this[list][dataIndex] = { ...this[list][dataIndex], ...data };

      } else if (action === 'remove') {
        this[list].splice(dataIndex, 1);
      }

    } else if (action === 'add-or-update') {
      this[list].push({ ...data });
    }

    if (list === 'changedData') {
      this.emitChanges(this.changedData);
    }
  }

  /**
   * initializeFormWrapperValues
   * @param rowData
   * @private
   */
  private initializeFormWrapperValues(rowData: { [key: string]: any; } = {}): void {
    this.formValues['id'] = rowData['id'];

    this.formFields?.forEach((field) => {
      this.formValues[field.field] = rowData[field.field] || '';
    });
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
