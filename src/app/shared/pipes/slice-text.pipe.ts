import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'sliceText',
    standalone: false
})
export class SliceTextPipe implements PipeTransform {

    transform(value: string, titleLength:number): unknown {
        value = value.trim();
        if (titleLength && titleLength > 70 && titleLength <= 85) {
            let line = value.slice(0, 165);
            let visibleLine = line.split(' ');
            visibleLine.slice(visibleLine.length - 1, 1);
            line = visibleLine.join(' ');
            return line + '...';
        } else if (titleLength && titleLength > 85 && titleLength < 100) {
            let line = value.slice(0, 115);
            let visibleLine = line.split(' ');
            visibleLine.slice(visibleLine.length - 1, 1);
            line = visibleLine.join(' ');
            return line + '...';
        } else if (titleLength && titleLength >= 100) {
            let line = value.slice(0, 105);
            let visibleLine = line.split(' ');
            visibleLine.slice(visibleLine.length - 1, 1);
            line = visibleLine.join(' ');
            return line + '...';
        }
        return value;
    }

}
