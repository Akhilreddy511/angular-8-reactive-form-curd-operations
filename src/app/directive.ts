import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[maskPattern]',
  standalone: true,
})
export class MaskDirective {
  @Input('maskPattern') enabled: boolean = true;
  @Input() show: boolean = false;

  private actualValue: string = '';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const raw = this.el.nativeElement.value.replace(/\D/g, '');
    this.actualValue = raw.slice(0, 9); // only 9 digits allowed
    this.updateView();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.show && event.key === 'Backspace') {
      event.preventDefault(); // don't delete X
      this.actualValue = this.actualValue.slice(0, -1); // remove last digit
      this.updateView();
    }
  }

  private format(value: string): string {
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 5);
    const part3 = value.slice(5, 9);
    return [part1, part2, part3].filter(Boolean).join('-');
  }

  private mask(value: string): string {
    const masked = 'X'.repeat(value.length);
    return this.format(masked);
  }

  private updateView() {
    const formatted = this.format(this.actualValue);
    this.el.nativeElement.value =
      this.enabled && !this.show ? this.mask(this.actualValue) : formatted;
  }

  toggleShow(show: boolean) {
    this.show = show;
    this.updateView();
  }

  getValue() {
    return this.actualValue;
  }
}

// @Input() maskPattern: boolean = false;
// @ViewChild(MaskDirective) maskDirective?: MaskDirective;

// toggleShow() {
//   this.show = !this.show;
//   this.maskDirective?.toggleShow(this.show);
// }

// <app-input-field
//   class="ssnCss"
//   label="Social Security Number"
//   hint="Enter only last 4 digits"
//   formControlName="ssn"
//   [maskPattern]="true"
//   [maxLength]="9"
//   ...
// ></app-input-field>
