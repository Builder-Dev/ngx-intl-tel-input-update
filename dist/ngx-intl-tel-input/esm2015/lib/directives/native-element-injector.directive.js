import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
/*
"Property 'nativeElement' does not exist on type 'FormControl'".
'NativeElementInjectorDirective' injects nativeElement to each control,
so we can access it from inside validator for example.
More about this approach and reasons for this:
https://github.com/angular/angular/issues/18025
https://stackoverflow.com/a/54075119/1617590
*/
export class NativeElementInjectorDirective {
    constructor(controlDir, host) {
        this.controlDir = controlDir;
        this.host = host;
    }
    ngOnInit() {
        if (this.controlDir.control) {
            this.controlDir.control['nativeElement'] = this.host.nativeElement;
        }
    }
}
NativeElementInjectorDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line: directive-selector
                selector: '[ngModel], [formControl], [formControlName]',
            },] }
];
NativeElementInjectorDirective.ctorParameters = () => [
    { type: NgControl },
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlLWVsZW1lbnQtaW5qZWN0b3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWludGwtdGVsLWlucHV0L3NyYy9saWIvZGlyZWN0aXZlcy9uYXRpdmUtZWxlbWVudC1pbmplY3Rvci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDOzs7Ozs7O0VBT0U7QUFLRixNQUFNLE9BQU8sOEJBQThCO0lBQzFDLFlBQ1MsVUFBcUIsRUFDckIsSUFBaUM7UUFEakMsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixTQUFJLEdBQUosSUFBSSxDQUE2QjtJQUN2QyxDQUFDO0lBQ0osUUFBUTtRQUNQLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7U0FDbkU7SUFDRixDQUFDOzs7WUFiRCxTQUFTLFNBQUM7Z0JBQ1YsK0NBQStDO2dCQUMvQyxRQUFRLEVBQUUsNkNBQTZDO2FBQ3ZEOzs7WUFiUSxTQUFTO1lBREUsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbi8qXHJcblwiUHJvcGVydHkgJ25hdGl2ZUVsZW1lbnQnIGRvZXMgbm90IGV4aXN0IG9uIHR5cGUgJ0Zvcm1Db250cm9sJ1wiLlxyXG4nTmF0aXZlRWxlbWVudEluamVjdG9yRGlyZWN0aXZlJyBpbmplY3RzIG5hdGl2ZUVsZW1lbnQgdG8gZWFjaCBjb250cm9sLFxyXG5zbyB3ZSBjYW4gYWNjZXNzIGl0IGZyb20gaW5zaWRlIHZhbGlkYXRvciBmb3IgZXhhbXBsZS5cclxuTW9yZSBhYm91dCB0aGlzIGFwcHJvYWNoIGFuZCByZWFzb25zIGZvciB0aGlzOlxyXG5odHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xODAyNVxyXG5odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTQwNzUxMTkvMTYxNzU5MFxyXG4qL1xyXG5ARGlyZWN0aXZlKHtcclxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRpcmVjdGl2ZS1zZWxlY3RvclxyXG5cdHNlbGVjdG9yOiAnW25nTW9kZWxdLCBbZm9ybUNvbnRyb2xdLCBbZm9ybUNvbnRyb2xOYW1lXScsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXRpdmVFbGVtZW50SW5qZWN0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0cHJpdmF0ZSBjb250cm9sRGlyOiBOZ0NvbnRyb2wsXHJcblx0XHRwcml2YXRlIGhvc3Q6IEVsZW1lbnRSZWY8SFRNTEZvcm1FbGVtZW50PlxyXG5cdCkge31cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdGlmICh0aGlzLmNvbnRyb2xEaXIuY29udHJvbCkge1xyXG5cdFx0XHR0aGlzLmNvbnRyb2xEaXIuY29udHJvbFsnbmF0aXZlRWxlbWVudCddID0gdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQ7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiJdfQ==