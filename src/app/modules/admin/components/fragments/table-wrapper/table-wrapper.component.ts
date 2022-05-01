import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { lastValueFrom, Subscription } from 'rxjs';
import { ApiResponsePayload } from '../../../../../core/interfaces/api/api-response.payload';
import { MessageSeverity } from '../../../../../core/interfaces/types/message-severity.type';
import { DayJsService } from '../../../../../core/services/dayjs/dayjs.service';
import { UtilsService } from '../../../../../shared';
import {
  AutoCompleteWrapperOptions,
} from '../auto-complete-wrapper/interfaces/auto-complete-wrapper-options.interface';
import { DropdownWrapperOptions } from '../dropdown-wrapper/interfaces/dropdown-wrapper-options.interface';
import { FormField } from '../form-wrapper/interfaces/form-field.interface';
import { FormWrapperService } from '../form-wrapper/services/form-wrapper.service';
import { MultiSelectWrapperOptions } from '../multi-select-wrapper/interfaces/multi-select-wrapper-options.interfaces';
import { SEVERITY_MESSAGE_SUMMARY } from './constants/common.constant';
import { DEFAULT_TOAST_CONFIRMATIONS, DEFAULT_TOAST_MESSAGES } from './constants/toast-config.constant';
import { DataConverter } from './interfaces/data-converter.interface';
import { SendRequestMethods } from './interfaces/send-request-methods.type';
import { TableColumn } from './interfaces/table-column.interface';
import { ToastPosition } from './interfaces/toast-position.type';
import { FormatValueDisplayPipe } from './pipes/format-value-display.pipe';
import { CrudService } from './services/crud/crud.service';
import { TableWrapperService } from './services/table-wrapper.service';

const addOrUpdate = 'add-or-update';
const rowToDeleteClass = 'table-wrapper-row-to-delete';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  providers: [MessageService, ConfirmationService, CrudService],
})
export class TableWrapperComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('wrappedTable', { static: false }) wrappedTable: Table | undefined;

  @ViewChild('filterGlobalInput', { static: false }) filterGlobalInput: InputText | undefined;

  @Input() toastPosition: ToastPosition = 'center';

  @Input() scrollHeight = '80vh';

  @Input() rowsReorderable = false;

  @Input() editElementLabel = 'Editer l\'élément';

  @Input() addElementLabel = 'Ajouter un élément';

  @Input() crudEndPoint = '';

  @Input() exportCsvFileName: string | undefined;

  @Input() columnList: TableColumn[] = [];

  @Input() formFields: FormField[] | undefined;

  @Input() dataGeneratorList?: DataConverter[];

  @Output() tableDataChange = new EventEmitter<any[]>();

  public globalFilterFields: string[] = [];

  public sortMode: 'single' | 'multiple' = 'single';

  public sortField = '';

  public sortOrder = 1;

  public formValues: any = {};

  public showFormDialog = false;

  public hasExportableData = false;

  public isValidForm = false;

  public isLoading = true;

  public selectedTableData: any[] = [];

  public changedData: any[] = [];

  public tableData: any[] = [];

  private originalData: any[] = [];

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly formWrapperService: FormWrapperService,
    private readonly crudService: CrudService,
  ) {
  }

  /**
   * applyDataGenerator
   * @param dataGenerator
   * @param data
   * @private
   */
  private static applyDataGenerator(dataGenerator: DataConverter, data: { [p: string]: any }): { [p: string]: any } {
    const [dataKey] = Object.keys(dataGenerator);
    return dataGenerator[dataKey]({ ...data });
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(TableWrapperService.onMessage().subscribe((payload) => {
      this.displayMessage(payload.message, payload.severity);
    }));

    if (this.crudEndPoint) {
      try {
        await this.loadAndInitializeTableData();

        if (this.tableData.length > 0) {
          this.hasExportableData = this.columnList.filter((col) => col.exportable).length > 0;

          this.columnList.forEach((column) => {
            this.initializeDefaultSortField(column);
            this.initializeGlobalFilter(column);
            this.initializePickList(column);

            if (column.autoCompleteWrapperOptions) {
              this.initializeAutoComplete(column.autoCompleteWrapperOptions);
            }
          });
        }

      } catch (e: any) {
        console.debug('ngOnInit error:', e);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data'] && changes['data'].currentValue && changes['data'].currentValue.length) {
      this.tableData = this.originalData.map((value: any) => ({ ...value }));
      this.hasExportableData = !!this.columnList.find((data) => data.exportable);
    }
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
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
  public async onOpenDialog(rowData: { [key: string]: any; } = {}): Promise<void> {
    if (!this.formFields || this.formFields.length === 0) {
      throw new Error(DEFAULT_TOAST_MESSAGES.invalidFormFields);
    }

    const listToLoad: Promise<void>[] = [];
    this.initializeFormOptions(this.formFields, listToLoad);

    await Promise.all(listToLoad);

    this.formValues = rowData;
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
  public async onDialogSaveAction(): Promise<void> {
    if (!this.formFields || Object.keys(this.formFields).length === 0) {
      throw new Error(DEFAULT_TOAST_MESSAGES.invalidFormFields);
    }

    const editMode = !!this.formValues.id;
    let data: { [p: string]: any };

    try {
      data = this.formWrapperService.convertFormValues(this.formFields, this.formValues);

      if (this.dataGeneratorList && this.dataGeneratorList.length) {
        this.dataGeneratorList.forEach((dataGenerator) => {
          data = TableWrapperComponent.applyDataGenerator(dataGenerator, { ...data });
        });
      }

    } catch (e: any) {
      console.debug('onDialogSaveAction error:', e);
    }

    // @ts-ignore
    if (!data) {
      return;
    }

    const callback = async (response: any) => {
      if (!response.id) {
        console.debug('onDialogSaveAction response:', response);
        this.displayMessage(
          editMode
            ? DEFAULT_TOAST_MESSAGES.onDialogSaveAction.update.error
            : DEFAULT_TOAST_MESSAGES.onDialogSaveAction.create.error, 'error',
        );
        return;
      }

      this.displayMessage(
        editMode
          ? DEFAULT_TOAST_MESSAGES.onDialogSaveAction.update.success
          : DEFAULT_TOAST_MESSAGES.onDialogSaveAction.create.success, 'success',
      );
      this.onDialogCloseAction();
    };

    if (editMode) {
      // @ts-ignore
      await this.sendRequest('put', this.crudEndPoint, { data }, callback);
      return;
    }
    // @ts-ignore
    await this.sendRequest('post', this.crudEndPoint, { data }, callback);
  }

  /**
   * onDuplicateRow
   * @param rowData
   * @param rowIndex
   */
  public onDuplicateRow(rowData: { [key: string]: any; }, rowIndex: number): void {
    try {
      const duplicated: { [key: string]: any; } = {
        // @ts-ignore
        ...rowData, id: `duplicatedAt_${DayJsService.getDate(undefined)}`,
      };

      if (rowData['position'] !== undefined) {
        duplicated['position'] = undefined;
      }

      // @ts-ignore
      this.wrappedTable.value.splice(rowIndex + 1, 0, duplicated);
      this.updateList(duplicated, addOrUpdate, 'changedData');
      this.displayMessage(DEFAULT_TOAST_MESSAGES.onDuplicateRow.info, 'info');

    } catch (e) {
      console.debug('onDuplicateRow error:', e);
      this.displayMessage(DEFAULT_TOAST_MESSAGES.onDuplicateRow.error, 'error');
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
      ...DEFAULT_TOAST_CONFIRMATIONS.onDeleteRow,
      reject: () => {
        rowElement.classList.remove(rowToDeleteClass);
      },
      accept: async () => {
        const callback = async (response: any) => {
          rowElement.classList.remove(rowToDeleteClass);

          if (response.message !== 'SUCCESS') {
            console.debug('onDeleteRow response', response);
            this.displayMessage(DEFAULT_TOAST_MESSAGES.onDeleteRow.error, 'error');
            return;
          }

          this.updateList({ id: elementId }, 'remove', 'changedData');
          this.updateList({ id: elementId }, 'remove', 'tableData');

          this.displayMessage(DEFAULT_TOAST_MESSAGES.onDeleteRow.success, 'success');
        };

        await this.sendRequest<{ id: string; }, ApiResponsePayload>(
          'delete', this.crudEndPoint, { id: elementId }, callback,
        );
      },
    });
  }

  /**
   * onDeleteSelectedRows
   */
  public onDeleteSelectedRows(): void {
    if (!this.selectedTableData || this.selectedTableData.length < 2) {
      return;
    }

    this.confirmationService.confirm({
      ...DEFAULT_TOAST_CONFIRMATIONS.onDeleteSelectedRows,
      message: DEFAULT_TOAST_CONFIRMATIONS.onDeleteSelectedRows.message.replace(
        '{{length}}', `${this.selectedTableData.length}`,
      ),
      accept: async () => {
        const idList: string[] = this.selectedTableData.map((element) => element.id);

        const callback = async (response: ApiResponsePayload) => {
          if (response.message !== 'SUCCESS') {
            console.debug('onDeleteSelectedRows error response:', response);
            this.displayMessage(DEFAULT_TOAST_MESSAGES.onDeleteSelectedRows.error, 'error');
            return;
          }

          this.displayMessage(DEFAULT_TOAST_MESSAGES.onDeleteSelectedRows.success, 'success');
        };

        await this.sendRequest<{ idList: string[]; }, ApiResponsePayload>(
          'delete', this.crudEndPoint, { idList }, callback,
        );
      },
    });
  }

  /**
   * onRowsReorder
   */
  public onRowsReorder({ dragIndex, dropIndex }: { dragIndex: number; dropIndex: number; }): void {
    if (!this.wrappedTable) {
      console.debug('No valid wrappedTable!');
      return;
    }

    if (dragIndex === dropIndex) {
      console.debug('Position has not changed!');
      return;
    }

    const elementId: string = this.wrappedTable.value[dropIndex].id;

    if (dropIndex > dragIndex && this.wrappedTable) {
      const [draggedElement] = this.wrappedTable.value.splice(dropIndex, 1);
      this.wrappedTable.value.splice(dropIndex - 1, 0, draggedElement);
    }

    this.updateDataPosition(elementId);
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
    const { pickListWrapperOptions } = col;
    if (!pickListWrapperOptions) {
      this.displayMessage(
        'Impossible d\'éditer ce champ, les options de configuration sont invalides.', 'error',
      );
      return;
    }

    const { sourceEndPoint } = pickListWrapperOptions;
    let { sourceList } = pickListWrapperOptions;

    if ((!sourceList || sourceList.length === 0) && !sourceEndPoint) {
      this.displayMessage('Impossible d\'éditer ce champ, données sources invalides.', 'error');
      return;
    }

    if ((!sourceList || sourceList.length === 0) && sourceEndPoint) {
      const callback = async (list: any[]) => {
        if (list.length === 0) {
          this.displayMessage(
            'Impossible d\'éditer ce champ, les données sources n\'ont pu être récupérées.', 'error',
          );
          return;
        }

        sourceList = list;
      };

      await this.sendRequest('get', sourceEndPoint, {}, callback);
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

    let data: { [p: string]: any }[];
    try {
      data = this.changedData.map((eachData: { [p: string]: any }) => {
        let generated = { ...eachData };
        if (this.dataGeneratorList && this.dataGeneratorList.length) {
          this.dataGeneratorList.forEach((dataGenerator) => {
            generated = TableWrapperComponent.applyDataGenerator(dataGenerator, { ...generated });
          });
        }
        return { ...eachData, ...generated };
      });

    } catch (e: any) {
      console.debug('onSaveChangedData error:', e);
    }

    const callback = async (response: any[]) => {
      if (!Array.isArray(response) || response.length === 0) {
        console.debug('onSaveDialogData response:', response);
        this.displayMessage(DEFAULT_TOAST_MESSAGES.onSaveChangedData.error, 'error');
        return;
      }

      const isPartialUpdate = (
        response.filter((updated) => updated && updated['id']).length
      ) < this.changedData.length;

      this.displayMessage(
        isPartialUpdate ? DEFAULT_TOAST_MESSAGES.onSaveChangedData.warn : DEFAULT_TOAST_MESSAGES.onSaveChangedData.success,
        isPartialUpdate ? 'warn' : 'success',
      );
    };

    await this.sendRequest<{ data: { [p: string]: any }[] }, { [p: string]: any }[]>(
      // @ts-ignore
      'put', this.crudEndPoint + '/many', { data }, callback,
    );
  }

  /**
   * onExportSelectedData
   */
  public onExportSelectedData(): void {
    if (!this.wrappedTable) {
      return;
    }

    if (this.selectedTableData.length === 0) {
      this.displayMessage(DEFAULT_TOAST_MESSAGES.onExportSelectedData.warn, 'warn');
      return;
    }

    if (this.exportCsvFileName && this.wrappedTable.exportFilename !== this.exportCsvFileName) {
      this.wrappedTable.exportFilename = this.exportCsvFileName;
    }

    try {
      const pipe = new FormatValueDisplayPipe();
      this.wrappedTable.exportFunction = (col: { field: string; data: any; }) => {
        return pipe.transform(col.data, col.field, false);
      };

      this.wrappedTable.columns = this.columnList.filter((col) => col.exportable);
      this.wrappedTable.exportCSV({ selectionOnly: true });
      this.wrappedTable.columns = this.columnList;

      this.displayMessage(DEFAULT_TOAST_MESSAGES.onExportSelectedData.info, 'info');

    } catch (e) {
      console.debug('onExportSelectedData error:', e);
      this.displayMessage(DEFAULT_TOAST_MESSAGES.onExportSelectedData.error, 'error');
    }
  }

  /**
   * resetTableChanges
   */
  public onResetTableChanges(): void {
    try {
      this.tableData = this.originalData.map((value: any) => ({ ...value }));
      // @ts-ignore
      this.wrappedTable.value = this.tableData;
      this.changedData = [];
      this.selectedTableData = [];
      this.emitChanges([]);

      this.displayMessage(DEFAULT_TOAST_MESSAGES.onResetTableChanges.info, 'info');

    } catch (e) {
      console.debug('onResetTableChanges', e);
      this.displayMessage(DEFAULT_TOAST_MESSAGES.onResetTableChanges.error, 'error');
    }
  }

  /**
   * loadAndInitializeTableData
   * @private
   */
  private async loadAndInitializeTableData(): Promise<void> {
    this.selectedTableData = [];
    this.changedData = [];

    const callback = async (response: any[]) => {
      this.originalData = response;
      this.tableData = response.map((value: any) => ({ ...value }));
    };

    await this.sendRequest('get', this.crudEndPoint, {}, callback);
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
    const { pickListWrapperOptions } = column;
    if (pickListWrapperOptions && pickListWrapperOptions.sourceEndPoint) {
      const callback = async (list: any[]) => {
        if (list.length === 0) {
          return;
        }

        pickListWrapperOptions.sourceList = pickListWrapperOptions.sourceAdapter
          // @ts-ignore
          ? list.map((data) => pickListWrapperOptions.sourceAdapter(data))
          : list;
      };

      this.sendRequest('get', pickListWrapperOptions.sourceEndPoint, {}, callback).catch((error) => {
        console.debug(error);
      });
    }
  }

  /**
   * initializeAutoComplete
   * @param autoCompleteWrapperOptions
   * @private
   */
  private initializeAutoComplete(autoCompleteWrapperOptions: AutoCompleteWrapperOptions): void {
    if (autoCompleteWrapperOptions.sourceEndPoint && autoCompleteWrapperOptions.sourceAdapter) {
      this.initializeAutoCompleteWithSourceEndPoint(autoCompleteWrapperOptions);

    } else if (autoCompleteWrapperOptions.sourceProperty && autoCompleteWrapperOptions.sourceAdapter) {
      this.initializeAutoCompleteWithSourceProperty(autoCompleteWrapperOptions);
    }
  }

  /**
   * initializeAutoCompleteWithSourceProperty
   * @param autoCompleteWrapperOptions
   * @private
   */
  private initializeAutoCompleteWithSourceProperty(autoCompleteWrapperOptions: AutoCompleteWrapperOptions): void {
    // @ts-ignore
    autoCompleteWrapperOptions.list = autoCompleteWrapperOptions.sourceAdapter(this.tableData);
  }

  /**
   * initializeAutoCompleteWithSourceEndPoint
   * @param autoCompleteWrapperOptions
   * @private
   */
  private initializeAutoCompleteWithSourceEndPoint(autoCompleteWrapperOptions: AutoCompleteWrapperOptions): void {
    const callback = async (list: any[]) => {
      if (list.length === 0) {
        return;
      }

      autoCompleteWrapperOptions.sourceList = list;
      // @ts-ignore
      autoCompleteWrapperOptions.list = autoCompleteWrapperOptions.sourceAdapter(list);
    };

    this.sendRequest('get', autoCompleteWrapperOptions.sourceEndPoint as string, {}, callback).catch(
      (error) => {
        console.debug(error);
      },
    );
  }

  /**
   * initializeFormOptions
   * @param formFields
   * @param listToLoad
   * @private
   */
  private initializeFormOptions(formFields: FormField[], listToLoad: Promise<void>[]): void {
    formFields.forEach((formField) => {
      const {
        multiSelectWrapperOptions, autoCompleteWrapperOptions, dropdownWrapperOptions, childFormFields,
      } = formField;

      if (multiSelectWrapperOptions && multiSelectWrapperOptions.sourceEndPoint) {
        listToLoad.push(
          this.initializeList(multiSelectWrapperOptions),
        );
      }

      if (autoCompleteWrapperOptions) {
        if (autoCompleteWrapperOptions.sourceEndPoint) {
          listToLoad.push(
            this.initializeList(autoCompleteWrapperOptions),
          );
        }

        if (autoCompleteWrapperOptions.sourceProperty) {
          this.initializeAutoCompleteWithSourceProperty(autoCompleteWrapperOptions);
        }
      }

      if (dropdownWrapperOptions && dropdownWrapperOptions.sourceEndPoint) {
        listToLoad.push(
          this.initializeList(dropdownWrapperOptions),
        );
      }

      if (childFormFields) {
        this.initializeFormOptions(childFormFields, listToLoad);
      }
    });
  }

  /**
   * initializeList
   * @param options
   * @private
   */
  private initializeList(
    options: MultiSelectWrapperOptions | AutoCompleteWrapperOptions | DropdownWrapperOptions,
  ): Promise<void> {
    if (!options.sourceEndPoint || !options.sourceAdapter) {
      return Promise.reject('Invalid options configuration! Cannot initialize the list.');
    }

    const callback = async (response: any[]) => {
      if (response.length === 0) {
        return;
      }
      // @ts-ignore
      options.list = options.sourceAdapter(response);
    };

    return this.sendRequest('get', options.sourceEndPoint, {}, callback);
  }

  /**
   * updateDataPosition
   * @private
   */
  private updateDataPosition(elementId: string): void {
    if (!this.wrappedTable) {
      console.debug('No valid wrappedTable!');
      return;
    }

    const elementToUpdateList: { [key: string]: any; }[] = [];

    this.tableData = this.wrappedTable.value.map((rowData: any, rowIndex: number) => {
      if (rowData.position === undefined && rowData.id !== elementId) {
        return { ...rowData };
      }

      let elementToUpdate: { [key: string]: any; } = {};
      if (rowData.position !== rowIndex) {
        elementToUpdate = { id: rowData.id, position: rowIndex };
        elementToUpdateList.push(elementToUpdate);
      }

      return { ...rowData, ...elementToUpdate };
    });

    if (elementToUpdateList.length === 0) {
      return;
    }

    elementToUpdateList.forEach((eachElement: any) => {
      this.updateList(eachElement, addOrUpdate, 'changedData');
    });
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
   * @param summary
   * @private
   */
  private displayMessage(message: string, severity: MessageSeverity, summary?: string): void {
    this.messageService.add({
      key: 'tableToast',
      severity,
      summary: summary || SEVERITY_MESSAGE_SUMMARY[severity],
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

  /**
   * sendRequest
   * @param method
   * @param endpoint
   * @param payload
   * @param callback
   * @private
   */
  private async sendRequest<t, T>(
    method: SendRequestMethods, endpoint: string, payload: t, callback: (response: any) => Promise<void>,
  ): Promise<void> {
    try {
      this.isLoading = true;
      const response: any = await lastValueFrom(this.crudService[method]<T>(endpoint, payload));

      if (!response) {
        console.debug('sendRequest server error - request details:', { method, endpoint, payload });
        this.displayMessage(DEFAULT_TOAST_MESSAGES.sendRequest.error, 'error');
        return;
      }

      await callback(response);

      if (method === 'get') {
        return;
      }

      await this.loadAndInitializeTableData();

    } catch (e: any) {
      console.debug('sendRequest error:', e);
      let details = '';
      if (e.details) {
        details = Array.isArray(e.details)
          ? e.details.map((detail: string) => detail.replace('data.', '')).join('\n')
          : e.details.replace('data.', '');
      }
      this.displayMessage(details, 'error', e.message);

    } finally {
      this.isLoading = false;
    }
  }
}
