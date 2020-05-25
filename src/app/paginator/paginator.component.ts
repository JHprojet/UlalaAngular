import { Component, OnInit, Input, Output, EventEmitter, ɵɵNgOnChangesFeature, OnChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

    @Input() data:Array<any>;
    @Output() PagTableEvent = new EventEmitter<Array<any>>();

    rowPerPage:number;
    showData:Array<any>;
    maxItem:number;
    currentPage:number;
    maxPage:number;
    minPage:number;
    pages:Array<number>;
    template:string;

    ngOnInit(): void {
      this.rowPerPage = 10;
      this.showData = this.data.slice(0,this.rowPerPage)
      this.maxPage = this.data.length % this.rowPerPage == 0 ? Math.round(this.data.length / this.rowPerPage) : Math.ceil(this.data.length / this.rowPerPage);
      this.minPage = 1;
      this.currentPage = 1;
      this.PagTableEvent.emit(this.showData);
    }

    constructor() {
    }

    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
      this.updateData(changes.data.currentValue);
    }

    emitShowData()
    {
      this.PagTableEvent.emit(this.showData);
    }

    public getFromPage(num:number):void
    {
        this.currentPage = num;
        this.showData = this.data.slice((this.currentPage-1)*this.rowPerPage ,this.currentPage*this.rowPerPage);
        this.emitShowData();
    }

    public isActive(num:number):boolean
    {
        if(num == this.currentPage) return true;
        else return false;
    }

    public numberDisplay(num:number):boolean
    {
        if(num < 1) return false;
        else if(num > this.maxPage) return false;
        else return true;
    }

    public nextPage()
    {
        if(this.currentPage < this.maxPage) 
        {
            this.currentPage++;
            this.showData = this.data.slice((this.currentPage-1)*this.rowPerPage ,this.currentPage*this.rowPerPage);        
            this.emitShowData();
        }
    }

    public previousPage()
    {
        if(this.currentPage != 1) 
        {
            this.currentPage--;
            this.showData = this.data.slice((this.currentPage-1)*this.rowPerPage ,this.currentPage*this.rowPerPage);
            this.emitShowData();
        }
    }

    public firstPage()
    {
        this.currentPage = 1;
        this.showData = this.data.slice(0,this.rowPerPage);
        this.emitShowData();
    }

    public lastPage()
    {
        this.currentPage = this.maxPage;
        this.showData = this.data.slice((this.maxPage-1)*this.rowPerPage ,this.maxPage*this.rowPerPage);
        this.emitShowData();
    }

    public setItemPerPage(num:number):void { this.rowPerPage = num }

    public updateData(tab:Array<any>):void
    {
        this.data = tab;
        this.rowPerPage = 10;
        this.showData = tab.slice(0,this.rowPerPage);
        this.emitShowData();
        this.maxPage = tab.length % this.rowPerPage == 0 ? Math.round(tab.length / this.rowPerPage) : Math.ceil(tab.length / this.rowPerPage);
    }
}
