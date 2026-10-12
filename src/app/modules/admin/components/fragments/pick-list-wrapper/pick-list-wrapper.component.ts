import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PickList } from 'primeng/picklist';
import { UtilsService } from '../../../../../shared';

@Component({
    selector: 'app-pick-list-wrapper',
    templateUrl: './pick-list-wrapper.component.html',
    standalone: false
})
export class PickListWrapperComponent implements OnInit {
  @ViewChild('pickListWrapped', { static: false }) pickList: PickList | undefined;

  @Input() inlineClass = '';

  @Input() inlineStyle: { [key: string]: any } = {};

  @Input() sourceHeader = '';

  @Input() targetHeader = '';

  @Input() showSourceFilter = true;

  @Input() showTargetFilter = true;

  @Input() showSourceControls = true;

  @Input() showTargetControls = true;

  @Input() sourceFilterPlaceholder = '';

  @Input() targetFilterPlaceholder = '';

  @Input() filterBy = '';

  @Input() dragdrop = true;

  @Input() stripedRows = true;

  @Input() selectionLimit?: number;

  @Input() sourceList: any[] = [];

  @Input() targetList: any[] = [];

  @Input() propertyToDisplay = '';

  @Output() closeOverlayPanel = new EventEmitter<any[] | undefined>();

  public availableList: any[] = [];

  public selectedList: any[] = [];

  private static setValidOrDefaultValue<T>(value: T, defaultValue: T): T {
    return value !== undefined ? value : defaultValue;
  }

  ngOnInit(): void {
    if (!this.sourceList || !this.sourceList.length) {
      throw new Error('Cannot initialize the pick-list, a valid source list must be passed!');
    }

    this.inlineStyle = PickListWrapperComponent.setValidOrDefaultValue(this.inlineStyle, {});
    this.sourceHeader = PickListWrapperComponent.setValidOrDefaultValue(this.sourceHeader, '');
    this.targetHeader = PickListWrapperComponent.setValidOrDefaultValue(this.targetHeader, '');
    this.showSourceControls = PickListWrapperComponent.setValidOrDefaultValue(this.showSourceControls, false);
    this.showTargetControls = PickListWrapperComponent.setValidOrDefaultValue(this.showTargetControls, false);
    this.sourceFilterPlaceholder = PickListWrapperComponent.setValidOrDefaultValue(this.sourceFilterPlaceholder, '');
    this.targetFilterPlaceholder = PickListWrapperComponent.setValidOrDefaultValue(this.targetFilterPlaceholder, '');
    this.showSourceFilter = PickListWrapperComponent.setValidOrDefaultValue(this.showSourceFilter, true);
    this.showTargetFilter = PickListWrapperComponent.setValidOrDefaultValue(this.showTargetFilter, true);
    this.filterBy = PickListWrapperComponent.setValidOrDefaultValue(this.filterBy, '');
    this.dragdrop = PickListWrapperComponent.setValidOrDefaultValue(this.dragdrop, true);
    this.stripedRows = PickListWrapperComponent.setValidOrDefaultValue(this.stripedRows, false);

    if (!this.targetList) {
      this.selectedList = [];
      this.availableList = this.sourceList.map((value) => ({ ...value }));
    } else {
      this.selectedList = this.propertyToDisplay ? this.targetList.map((value) => ({ ...value })) : [...this.targetList];
      this.availableList = this.sourceList.filter(
        (available) => this.propertyToDisplay
          ? !this.targetList.find((selected) => selected[this.propertyToDisplay] === available[this.propertyToDisplay])
          : !this.targetList.includes(available),
      );

      this.sortLists();
    }
  }

  public sortLists(): void {
    if (!this.propertyToDisplay) {
      this.availableList.sort();
      this.selectedList.sort();
    } else {
      this.availableList = UtilsService.sortObjectList([...this.availableList], 'asc', this.propertyToDisplay);
      this.selectedList = UtilsService.sortObjectList([...this.selectedList], 'asc', this.propertyToDisplay);
    }
  }

  public onCloseOverlayPanel(): void {
    this.closeOverlayPanel.emit();
  }

  public onSaveData(): void {
    this.closeOverlayPanel.emit(this.selectedList);
  }
}
