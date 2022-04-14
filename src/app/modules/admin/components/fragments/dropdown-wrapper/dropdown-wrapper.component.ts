import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface DropdownOption {
  label: string;

  value: string | number;
}

@Component({
  selector: 'app-dropdown-wrapper',
  templateUrl: './dropdown-wrapper.component.html',
  styleUrls: ['./dropdown-wrapper.component.scss'],
})
export class DropdownWrapperComponent implements OnInit {
  @Input() inlineStyle: { [key: string]: any } = {};

  @Input() inlineClass = '';

  @Input() list: DropdownOption[] | undefined;

  @Input() stringList: string[] | undefined;

  @Input() selectedValue: any;

  @Input() scrollHeight = '200px';

  @Output() selectedValueChange = new EventEmitter<any>();

  public dropdownList: DropdownOption[] = [];

  private static convertStringListToDropdownList(list: string[]): DropdownOption[] {
    return list.map((el) => ({ label: el, value: el }));
  }

  private static reorderList(list: DropdownOption[], selectedValue: string | number): DropdownOption[] {
    const reorderedList = [...list];
    const selectedIndex = list.findIndex((option) => option.value === selectedValue);
    const [selectedOption] = reorderedList.splice(selectedIndex, 1);
    reorderedList.unshift(selectedOption);
    return reorderedList;
  }

  ngOnInit(): void {
    if ((!this.list || !this.list.length) && (!this.stringList || !this.stringList.length)) {
      this.dropdownList = [];
      throw new Error('Cannot initialize the dropdown, a valid list must be passed!');
    }

    const validList = this.stringList ? DropdownWrapperComponent.convertStringListToDropdownList(this.stringList) : this.list as DropdownOption[];

    if (!this.selectedValue) {
      this.selectedValue = validList[0].value;
      this.dropdownList = [...validList];
    } else {
      const isValidValue = validList.map((option) => option.value).includes(this.selectedValue);
      if (!isValidValue) {
        this.dropdownList = [];
        throw new Error('Cannot initialize the dropdown, a valid selectedValue must be passed!');
      }

      this.dropdownList = DropdownWrapperComponent.reorderList([...validList], this.selectedValue);
    }
  }

  public onSelectedValueChange(): void {
    this.selectedValueChange.emit(this.selectedValue);
  }
}
