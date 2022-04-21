// animations

export { HEADER_ANIMATION } from './services/animations/templates/header.animation';
export { IN_OUT_TEMPLATE_ANIMATION } from './services/animations/templates/in-out-template.animation';
export { STAGGER_IN_OUT_TEMPLATE_ANIMATION } from './services/animations/templates/stagger-in-out-template.animation';
export { IAnimationAction } from './services/animations/interfaces/animation-action.interface';
export { IAnimationServiceResponse } from './services/animations/interfaces/animation-response.interface';

// pipes
export { DateFormatPipe } from './pipes/date-format.pipe';
export { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe';
export { HeaderTitleFormatPipe } from './pipes/header-title-format.pipe';
export { IncompressibleSpacePipe } from './pipes/incompressible-space.pipe';

// services
export { ApiService } from '../core/services/api/api.service';
export { DataService } from './services/data/data.service';
export { TagsService } from './services/tags/tags.service';
export { UtilsService } from './services/utils/utils.service';
