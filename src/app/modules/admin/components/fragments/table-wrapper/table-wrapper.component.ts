import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom, Subscription, tap } from 'rxjs';
import { DropdownOption } from '../dropdown-wrapper/dropdown-wrapper.component';
import { FormFields } from '../form-wrapper/form-wrapper.component';
import { FormWrapperService } from '../form-wrapper/services/form-wrapper.service';
import { InputWrapperType } from '../input-wrapper/input-wrapper.component';
import { CrudService } from './services/crud.service';

export interface TableColumn {
  field: string;

  header: string;

  style?: string;

  exportable?: boolean;

  editable?: boolean;

  inputType?: InputWrapperType;

  /**
   * Textarea options
   */
  rows?: number;

  /**
   * Number options
   */
  min?: number;

  max?: number;

  step?: number;

  /**
   * Dropdown options
   */
  list?: DropdownOption[];

  stringList?: string[];

  scrollHeight?: string;
}

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss'],
  providers: [MessageService, ConfirmationService, CrudService],
})
export class TableWrapperComponent implements OnInit, OnChanges, OnDestroy {
  @Input() columnList: TableColumn[] = [];

  @Input() rowsNumber: number | undefined;

  @Input() scrollHeight = '85vh';

  @Input() reorderable = false;

  @Input() formFields: FormFields[] | undefined;

  @Input() crudEndPoint = '';

  @Output() tableDataChange = new EventEmitter<any[]>();

  public tableData: any[] = [];

  public selectedTableData: any[] = [];

  public elementDialog = false;

  public formData: any = {};

  public changedData: any[] = [];

  public hasExportableData = false;

  public submitted = true;

  private data: any[] = [];

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly formWrapperService: FormWrapperService,
    private readonly crudService: CrudService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.formWrapperService.onFormValueChange().subscribe((formValue) => {
        this.formData = { ...this.formData, ...formValue };
      }),
    );

    this.subscriptionList.push(
      this.crudService.get<any[]>(this.crudEndPoint).pipe(
        tap((dataLoaded: any[]) => {
          this.tableData = dataLoaded.map((value: any) => ({ ...value }));
        }),
      ).subscribe({
        next: (dataLoaded: any[]) => {
          this.data = dataLoaded;
        },
        error: (err) => {
          console.warn(err.message);
          console.error(err);
        },
        complete: () => {
          this.submitted = false;
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data'] && changes['data'].currentValue && changes['data'].currentValue.length) {
      this.tableData = this.data.map((value: any) => ({ ...value }));
      this.hasExportableData = this.columnList.filter((data) => data.exportable).length > 0;
    }
  }

  public onCloseDialog(): void {
    this.elementDialog = false;
    this.submitted = false;

    this.formData = {};
  }

  public onOpenDialog(): void {
    this.formData = {};
    this.updateFormWrapperConfigValues();
    this.elementDialog = true;
  }

  public editRow(rowData: { [key: string]: any; }): void {
    this.formData = { ...rowData };
    this.updateFormWrapperConfigValues({ ...rowData });
    this.elementDialog = true;
  }

  deleteRow(element: any) {
    this.confirmationService.confirm({
      message: 'Supprimer cet élément ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tableData = this.tableData.filter((val) => val.id !== element.id);
        this.formData = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Opération réussie',
          detail: 'Elément supprimé !',
          life: 3000,
        });
      },
    });
  }

  deleteSelectedRows() {
    this.confirmationService.confirm({
      message: 'Supprimer tous les éléments sélectionnés ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tableData = this.tableData.filter(val => !this.selectedTableData.includes(val));
        this.selectedTableData = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Opération réussie',
          detail: 'Eléments supprimés !',
          life: 3000,
        });
      },
    });
  }

  public onRowsReorder(): void {
    if (this.tableData[0].position !== undefined) {
      this.tableData.forEach((data, i) => {
        data.position = i;
      });

      this.tableData.forEach((rowData) => {
        const originalData = this.data.find((element) => element.id === rowData.id);
        if (originalData.position !== rowData.position) {
          this.updateChangedData(rowData);
        }
      });
    }
  }

  public onCellValueChange(elementId: string, col: TableColumn, value: any): void {
    const originalData = this.data.find((element) => element.id === elementId)[col.field];
    let newData: any;

    if ((col.inputType === 'number' || typeof originalData === 'number') && originalData !== +value) {
      newData = this.tableData.find((element) => element.id === elementId);
      newData[col.field] = +value;

    } else if (originalData !== value) {
      newData = this.tableData.find((element) => element.id === elementId);
    }

    if (newData) {
      this.updateChangedData(newData);
    }
  }

  public async onSaveDialogData(): Promise<void> {
    this.updateTableData({ ...this.formData });
    this.updateChangedData({ ...this.formData });

    try {
      this.submitted = true;

      if (this.formData.id) {
        await lastValueFrom(this.crudService.put<any>(this.crudEndPoint, { data: this.formData }));
      } else {
        await lastValueFrom(this.crudService.post<any>(this.crudEndPoint + '/new', { data: this.formData }));
      }
      this.onCloseDialog();

      this.messageService.add({
        severity: 'success',
        summary: 'Réussi',
        detail: 'Elément bien mis à jour !',
        life: 3000,
      });

    } catch (e: any) {
      console.warn(e.message);
      console.error(e);
      this.messageService.add({
        severity: 'error',
        summary: 'Raté',
        detail: 'Elément non mis à jour !',
        life: 3000,
      });
    } finally {
      this.submitted = false;
    }
  }

  public onSaveChangedData(): void {
    this.submitted = true;
    this.emitChanges(this.changedData);
  }

  public onExportSelectedData(): void {
    const dataList: any[] = !this.selectedTableData || !this.selectedTableData.length
      ? [...this.tableData] : [...this.selectedTableData];

    const toExport = dataList.map((data) => {
      const expectedFields: { [key: string]: any; } = {};
      this.columnList.forEach((col) => {
        if (col.exportable) {
          expectedFields[col.field] = data[col.field];
        }
      });

      return Object.keys(expectedFields).length ? expectedFields : undefined;
    }).filter((isValid) => !!isValid);

    if (!toExport.length) {
      console.warn('There is no data to export!');
      return;
    }

    console.debug('onExportData:', JSON.stringify(toExport));
  }

  public resetTableChanges(): void {
    this.tableData = this.data.map((value: any) => ({ ...value }));
    this.changedData = [];
  }

  private updateTableData(data: any): void {
    const dataIndex = this.tableData.findIndex((element) => element.id === data.id);
    this.tableData[dataIndex] = { ...data };
  }

  private updateChangedData(data: any) {
    const changedDataIndex = this.changedData.findIndex((element) => element.id === data.id);
    if (changedDataIndex !== -1) {
      this.changedData[changedDataIndex] = data;
    } else {
      this.changedData.push(data);
    }
  }

  private updateFormWrapperConfigValues(rowData: { [key: string]: any; } = {}): void {
    this.formFields?.forEach((field) => {
      this.formData[field.name] = rowData[field.name] || '';
    });
  }

  private emitChanges(changedData: any[]): void {
    if (!changedData.length) {
      return;
    }

    this.tableDataChange.emit([...changedData]);
    this.changedData = [];
  }
}
