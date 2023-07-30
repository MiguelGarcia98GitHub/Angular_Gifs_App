import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'nE7RycfxVm32tb5BYe8vJfadWu21LMy8';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  organizeHistory(tag: string) {
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(
        (givenTag) => givenTag !== tag
      );
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory.slice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage() {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage() {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  async searchTag(tag: string) {
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifsList = resp.data;
      });
  }
}
