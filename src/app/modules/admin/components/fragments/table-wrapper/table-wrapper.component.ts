import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

export interface TableColumn {
  field: string;

  header: string;
}

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class TableWrapperComponent implements OnChanges {
  @Input() data: any[] = [];

  @Input() columnList: TableColumn[] = [];

  public tableData: any[] = [];

  public newElement: any;

  public selectedProducts: any[] = [];

  public addElementDialog = false;

  private submitted = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data'] && changes['data'].currentValue && changes['data'].currentValue.length) {
      this.tableData = changes['data'].currentValue;
    }
  }

  openNew() {
    this.newElement = {};
    this.submitted = false;
    this.addElementDialog = true;
  }

  editElement(element: any) {
    this.newElement = {...element};
    this.addElementDialog = true;
  }

  deleteElement(element: any) {
    this.confirmationService.confirm({
      message: 'Supprimer cet élément ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tableData = this.tableData.filter((val) => val.id !== element.id);
        this.newElement = {};
        this.messageService.add({severity:'success', summary: 'Opération réussie', detail: 'Elément supprimé !', life: 3000});
      }
    });
  }

  deleteSelectedElements() {
    this.confirmationService.confirm({
      message: 'Supprimer tous les éléments sélectionnés ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tableData = this.tableData.filter(val => !this.selectedProducts.includes(val));
        this.selectedProducts = [];
        this.messageService.add({ severity: 'success', summary: 'Opération réussie', detail: 'Eléments supprimés !', life: 3000 });
      },
    });
  }

  hideDialog() {
    this.addElementDialog = false;
    this.submitted = false;
  }

  saveNewElement() {
    this.submitted = true;
  }
}
