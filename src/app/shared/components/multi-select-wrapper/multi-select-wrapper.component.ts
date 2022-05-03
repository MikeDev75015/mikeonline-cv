import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT } from '../dropdown-wrapper/constants/dropdown-wrapper.constant';
import { DropdownOption } from '../dropdown-wrapper/interfaces/dropdown-option.interface';

@Component({
  selector: 'app-multi-select-wrapper',
  templateUrl: './multi-select-wrapper.component.html',
})
export class MultiSelectWrapperComponent implements OnInit {
  @Input() scrollHeight = DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT;

  @Input() inlineStyle: { [key: string]: any } = {};

  @Input() inlineClass = '';

  @Input() title = '';

  @Input() placeholder = '';

  @Input() list: DropdownOption[] | undefined;

  @Input() stringList: string[] | undefined;

  @Input() defaultLabel = 'Sélectionner les éléments à ajouter';

  @Input() selectionLimit: number | undefined;

  @Input() selectedValues: any[] = [];

  @Output() selectedValuesChange = new EventEmitter<any>();

  public optionList: DropdownOption[] = [];

  public appendTo = 'body';

  private static convertStringListToDropdownList(list: string[]): DropdownOption[] {
    list.sort();
    return list.map((el) => ({ label: el, value: el }));
  }

  private static sortObjectList(list: DropdownOption[], way: 'asc' | 'desc'): DropdownOption[] {
    return list.sort((a, b) => {
      if (a.label === undefined || b.label === undefined) {
        throw new Error('One of values to compare is undefined, cannot sort object list!');
      }
      return way === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label);
    });
  }

  ngOnInit(): void {
    if ((!this.list || !this.list.length) && (!this.stringList || !this.stringList.length)) {
      this.optionList = [];
      throw new Error('Cannot initialize the multiselect, a valid list must be passed!');
    }

    if (!this.scrollHeight) {
      this.scrollHeight = DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT;
    }

    const validList = this.stringList
      ? MultiSelectWrapperComponent.convertStringListToDropdownList(this.stringList)
      : MultiSelectWrapperComponent.sortObjectList(this.list as DropdownOption[], 'asc');
    this.optionList = [...validList];
  }

  public onSelectedValuesChange(values: any): void {
    this.selectedValues = values;
    this.selectedValuesChange.emit(this.selectedValues);
  }
}
