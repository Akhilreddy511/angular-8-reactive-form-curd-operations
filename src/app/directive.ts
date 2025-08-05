import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ssnMask]',
  standalone: true,
})
export class SSNMaskDirective {
  @Input('ssnMask') enabled: boolean = true;
  @Input() show: boolean = false;

  private actualValue: string = '';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.actualValue = input.slice(0, 9); // Max 9 digits
    this.updateView();
  }

  private formatSSN(value: string): string {
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 5);
    const part3 = value.slice(5, 9);
    return `${part1}${part2 ? '-' + part2 : ''}${part3 ? '-' + part3 : ''}`;
  }

  private maskSSN(value: string): string {
    return value.replace(/\d/g, 'X');
  }

  private updateView() {
    const formatted = this.formatSSN(this.actualValue);
    this.el.nativeElement.value =
      this.enabled && !this.show ? this.maskSSN(formatted) : formatted;
  }

  // Called by external components
  toggleShow(show: boolean) {
    this.show = show;
    this.updateView();
  }

  getValue() {
    return this.actualValue;
  }
}

// @Input() ssnMask: boolean = false;
// @ViewChild(SSNMaskDirective) ssnDirective?: SSNMaskDirective;

// toggleShow() {
//   this.show = !this.show;
//   this.ssnDirective?.toggleShow(this.show);
// }

// <input
//   class="form-control"
//   [type]="'text'"
//   (input)="onInput($event)"
//   [ssnMask]="ssnMask"
//   [show]="show"
// />
// <a *ngIf="ssnMask" class="toggle-link" (click)="toggleShow()">
//   {{ show ? 'Hide' : 'Show' }}
// </a>

// <app-input-field
//   label="Social Security Number"
//   formControlName="ssn"
//   [mask]="true"
//   [ssnMask]="true"
//   [numbersOnly]="true"
//   ...
// ></app-input-field>
