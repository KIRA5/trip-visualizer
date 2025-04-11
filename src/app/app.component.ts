import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor
import { FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import modules here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  startPoint: string = '';
  endPoint: string = '';
  trips: { start: string; end: string }[] = [];
  svgWidth = 500;
  svgHeight = 300;
  verticalSpacing = 30;

  // Define valid locations based on the screenshot and common cities
  validLocations = ['BLR', 'MAA', 'HYD', 'DEL', 'OOTY', 'CHENNAI', 'BANGALORE'];

  addTrip() {
    const startUpper = this.startPoint.toUpperCase().trim();
    const endUpper = this.endPoint.toUpperCase().trim();

    // Validate inputs
    if (this.isValidLocation(startUpper) && this.isValidLocation(endUpper) && startUpper !== endUpper) {
      this.trips.push({ start: startUpper, end: endUpper });
      this.startPoint = '';
      this.endPoint = '';
    } else {
      alert('Please enter valid and different Start and End Points from the list: ' + this.validLocations.join(', '));
    }
  }

  // Check if the location is valid
  isValidLocation(location: string): boolean {
    return this.validLocations.includes(location);
  }

  getShortName(point: string): string {
    return point.substring(0, 3).toUpperCase();
  }

  getYPosition(index: number): number {
    return index * this.verticalSpacing;
  }

  getLevelColor(index: number): string {
    return this.isIdenticalTrip(index) ? '#ff9800' : '#2196f3'; // Orange for Level 2, Blue for Level 1
  }

  isIdenticalTrip(index: number): boolean {
    if (index === 0) return false;
    const current = this.trips[index];
    const previous = this.trips[index - 1];
    return current.start === previous.start && current.end === previous.end;
  }

  isContinuedTrip(index: number): boolean {
    if (index === 0) return false;
    const current = this.trips[index];
    const previous = this.trips[index - 1];
    return previous.end === current.start;
  }

  getEndX(index: number): number {
    return this.svgWidth - 50;
  }

  getPathData(index: number): string {
    const startX = 50;
    const endX = this.svgWidth - 50;
    const y = 10;
    if (index === 0 || !this.isContinuedTrip(index)) {
      return `M${startX},${y} L${endX},${y}`; // Straight line
    }
    const midX = (startX + endX) / 2;
    return `M${startX},${y} Q${midX},${y - 20} ${endX},${y}`; // Curved line for non-continued
  }
}