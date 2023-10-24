import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';


@Pipe({ name: 'asFormGroup' })
export class AsFormGroupPipe implements PipeTransform {
    transform(control: AbstractControl) {
        return control as FormGroup;
    }
}

@Pipe({ name: 'asFormArray' })
export class AsFormArrayPipe implements PipeTransform {
    transform(control: AbstractControl) {
        return control as FormArray;
    }
}

@Pipe({ name: 'asFormControl' })
export class AsFormControlPipe implements PipeTransform {
    transform(control: AbstractControl) {
        return control as FormControl;
    }
}
