import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT } from './constants/dropdown-wrapper.constant';
import { DropdownOption } from './interfaces/dropdown-option.interface';

@Component({
  selector: 'app-dropdown-wrapper',
  templateUrl: './dropdown-wrapper.component.html',
})
export class DropdownWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('dropdownWrapped', { static: false }) dropdown: Dropdown | undefined;

  @Input() scrollHeight = DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT;

  @Input() inlineStyle: { [key: string]: any } = {};

  @Input() inlineClass = '';

  @Input() title = '';

  @Input() name = '';

  @Input() placeholder = '';

  @Input() list: DropdownOption[] | undefined;

  @Input() stringList: string[] | undefined;

  @Input() selectedValue: any;

  @Output() selectedValueChange = new EventEmitter<any>();

  public dropdownList: DropdownOption[] = [];

  public appendTo = 'body';

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

    if (!this.scrollHeight) {
      this.scrollHeight = DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT;
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

  ngAfterViewInit(): void {
    this.selectedValueChange.emit(this.selectedValue);
    if (this.dropdown) {
      this.dropdown.name = this.name || '';
      this.dropdown.placeholder = this.placeholder || '';
    }
  }

  public onSelectedValueChange(value: any): void {
    this.selectedValue = value;
    this.selectedValueChange.emit(this.selectedValue);
  }
}
