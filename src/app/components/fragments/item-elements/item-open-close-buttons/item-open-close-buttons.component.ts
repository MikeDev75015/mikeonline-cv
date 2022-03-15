import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnimationsService } from '../../../../core/services/animations/animations.service';
import { IN_OUT_TEMPLATE_ANIMATION } from '../../../../shared/animations/in-out-template.animation';
import { UtilsService } from '../../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-item-open-close-buttons',
  templateUrl: './item-open-close-buttons.component.html',
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ClosedLayer',
      false,
    ),
  ],
})
export class ItemOpenCloseButtonsComponent {
  @Input() enableOpenCloseButtons!: boolean;

  @Input() masked!: boolean;

  @Input() opened!: boolean;

  @Input() btnOpen!: boolean;

  @Output() onToggleView: EventEmitter<string> = new EventEmitter<string>();

  private elementId = '';

  constructor(
    private readonly animationService: AnimationsService,
    private readonly utilsService: UtilsService,
  ) {
  }

  public toggleView(request: string): void {
    this.onToggleView.emit(request);
  }

  public onAnimation(e: any): void {
    this.elementId = this.utilsService.getElementId(e.element);
    this.animationService.onPhase(e, this.elementId);
  }
}
