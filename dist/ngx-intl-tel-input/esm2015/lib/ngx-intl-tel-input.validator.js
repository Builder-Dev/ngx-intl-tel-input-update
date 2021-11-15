import * as lpn from 'google-libphonenumber';
/*
We use "control: any" instead of "control: FormControl" to silence:
"Property 'nativeElement' does not exist on type 'FormControl'".
This happens because I've expanded control with nativeElement via
'NativeElementInjectorDirective' to get an access to the element.
More about this approach and reasons for this:
https://github.com/angular/angular/issues/18025
https://stackoverflow.com/a/54075119/1617590
*/
export const phoneNumberValidator = (control) => {
    if (!control.value) {
        return;
    }
    // Find <input> inside injected nativeElement and get its "id".
    const el = control.nativeElement;
    const inputBox = el
        ? el.querySelector('input[type="tel"]')
        : undefined;
    if (inputBox) {
        const id = inputBox.id;
        const isCheckValidation = inputBox.getAttribute('validation');
        if (isCheckValidation === 'true') {
            const isRequired = control.errors && control.errors.required === true;
            const error = { validatePhoneNumber: { valid: false } };
            inputBox.setCustomValidity('Invalid field.');
            let number;
            try {
                number = lpn.PhoneNumberUtil.getInstance().parse(control.value.number, control.value.countryCode);
            }
            catch (e) {
                if (isRequired === true) {
                    return error;
                }
                else {
                    inputBox.setCustomValidity('');
                }
            }
            if (control.value) {
                if (!number) {
                    return error;
                }
                else {
                    if (!lpn.PhoneNumberUtil.getInstance().isValidNumberForRegion(number, control.value.countryCode)) {
                        return error;
                    }
                    else {
                        inputBox.setCustomValidity('');
                    }
                }
            }
        }
        else if (isCheckValidation === 'false') {
            inputBox.setCustomValidity('');
            control.clearValidators();
        }
    }
    return;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWludGwtdGVsLWlucHV0LnZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbnRsLXRlbC1pbnB1dC9zcmMvbGliL25neC1pbnRsLXRlbC1pbnB1dC52YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQztBQUU3Qzs7Ozs7Ozs7RUFRRTtBQUNGLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLENBQUMsT0FBWSxFQUFFLEVBQUU7SUFDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7UUFDbkIsT0FBTztLQUNQO0lBQ0QsK0RBQStEO0lBQy9ELE1BQU0sRUFBRSxHQUFnQixPQUFPLENBQUMsYUFBNEIsQ0FBQztJQUM3RCxNQUFNLFFBQVEsR0FBcUIsRUFBRTtRQUNwQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztRQUN2QyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2IsSUFBSSxRQUFRLEVBQUU7UUFDYixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5RCxJQUFJLGlCQUFpQixLQUFLLE1BQU0sRUFBRTtZQUNqQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQztZQUN0RSxNQUFNLEtBQUssR0FBRyxFQUFFLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7WUFFeEQsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFN0MsSUFBSSxNQUF1QixDQUFDO1lBRTVCLElBQUk7Z0JBQ0gsTUFBTSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUMvQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQ3pCLENBQUM7YUFDRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNYLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtvQkFDeEIsT0FBTyxLQUFLLENBQUM7aUJBQ2I7cUJBQU07b0JBQ04sUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUMvQjthQUNEO1lBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNaLE9BQU8sS0FBSyxDQUFDO2lCQUNiO3FCQUFNO29CQUNOLElBQ0MsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLHNCQUFzQixDQUN4RCxNQUFNLEVBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQ3pCLEVBQ0E7d0JBQ0QsT0FBTyxLQUFLLENBQUM7cUJBQ2I7eUJBQU07d0JBQ04sUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMvQjtpQkFDRDthQUNEO1NBQ0Q7YUFBTSxJQUFJLGlCQUFpQixLQUFLLE9BQU8sRUFBRTtZQUN6QyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFL0IsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzFCO0tBQ0Q7SUFDRCxPQUFPO0FBQ1IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbHBuIGZyb20gJ2dvb2dsZS1saWJwaG9uZW51bWJlcic7XHJcblxyXG4vKlxyXG5XZSB1c2UgXCJjb250cm9sOiBhbnlcIiBpbnN0ZWFkIG9mIFwiY29udHJvbDogRm9ybUNvbnRyb2xcIiB0byBzaWxlbmNlOlxyXG5cIlByb3BlcnR5ICduYXRpdmVFbGVtZW50JyBkb2VzIG5vdCBleGlzdCBvbiB0eXBlICdGb3JtQ29udHJvbCdcIi5cclxuVGhpcyBoYXBwZW5zIGJlY2F1c2UgSSd2ZSBleHBhbmRlZCBjb250cm9sIHdpdGggbmF0aXZlRWxlbWVudCB2aWFcclxuJ05hdGl2ZUVsZW1lbnRJbmplY3RvckRpcmVjdGl2ZScgdG8gZ2V0IGFuIGFjY2VzcyB0byB0aGUgZWxlbWVudC5cclxuTW9yZSBhYm91dCB0aGlzIGFwcHJvYWNoIGFuZCByZWFzb25zIGZvciB0aGlzOlxyXG5odHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xODAyNVxyXG5odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTQwNzUxMTkvMTYxNzU5MFxyXG4qL1xyXG5leHBvcnQgY29uc3QgcGhvbmVOdW1iZXJWYWxpZGF0b3IgPSAoY29udHJvbDogYW55KSA9PiB7XHJcblx0aWYgKCFjb250cm9sLnZhbHVlKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdC8vIEZpbmQgPGlucHV0PiBpbnNpZGUgaW5qZWN0ZWQgbmF0aXZlRWxlbWVudCBhbmQgZ2V0IGl0cyBcImlkXCIuXHJcblx0Y29uc3QgZWw6IEhUTUxFbGVtZW50ID0gY29udHJvbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xyXG5cdGNvbnN0IGlucHV0Qm94OiBIVE1MSW5wdXRFbGVtZW50ID0gZWxcclxuXHRcdD8gZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInRlbFwiXScpXHJcblx0XHQ6IHVuZGVmaW5lZDtcclxuXHRpZiAoaW5wdXRCb3gpIHtcclxuXHRcdGNvbnN0IGlkID0gaW5wdXRCb3guaWQ7XHJcblx0XHRjb25zdCBpc0NoZWNrVmFsaWRhdGlvbiA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZSgndmFsaWRhdGlvbicpO1xyXG5cdFx0aWYgKGlzQ2hlY2tWYWxpZGF0aW9uID09PSAndHJ1ZScpIHtcclxuXHRcdFx0Y29uc3QgaXNSZXF1aXJlZCA9IGNvbnRyb2wuZXJyb3JzICYmIGNvbnRyb2wuZXJyb3JzLnJlcXVpcmVkID09PSB0cnVlO1xyXG5cdFx0XHRjb25zdCBlcnJvciA9IHsgdmFsaWRhdGVQaG9uZU51bWJlcjogeyB2YWxpZDogZmFsc2UgfSB9O1xyXG5cclxuXHRcdFx0aW5wdXRCb3guc2V0Q3VzdG9tVmFsaWRpdHkoJ0ludmFsaWQgZmllbGQuJyk7XHJcblxyXG5cdFx0XHRsZXQgbnVtYmVyOiBscG4uUGhvbmVOdW1iZXI7XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdG51bWJlciA9IGxwbi5QaG9uZU51bWJlclV0aWwuZ2V0SW5zdGFuY2UoKS5wYXJzZShcclxuXHRcdFx0XHRcdGNvbnRyb2wudmFsdWUubnVtYmVyLFxyXG5cdFx0XHRcdFx0Y29udHJvbC52YWx1ZS5jb3VudHJ5Q29kZVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRpZiAoaXNSZXF1aXJlZCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpbnB1dEJveC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY29udHJvbC52YWx1ZSkge1xyXG5cdFx0XHRcdGlmICghbnVtYmVyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdFx0IWxwbi5QaG9uZU51bWJlclV0aWwuZ2V0SW5zdGFuY2UoKS5pc1ZhbGlkTnVtYmVyRm9yUmVnaW9uKFxyXG5cdFx0XHRcdFx0XHRcdG51bWJlcixcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sLnZhbHVlLmNvdW50cnlDb2RlXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpbnB1dEJveC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGlzQ2hlY2tWYWxpZGF0aW9uID09PSAnZmFsc2UnKSB7XHJcblx0XHRcdGlucHV0Qm94LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcclxuXHJcblx0XHRcdGNvbnRyb2wuY2xlYXJWYWxpZGF0b3JzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybjtcclxufTtcclxuIl19