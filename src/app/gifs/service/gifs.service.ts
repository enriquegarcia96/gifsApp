import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse, Images } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'D9r9G5LIW5chnQD7b3HjoQrZFJGPQG8c';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private httpClient: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    // resultados
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string = '') {
    query = query.trim().toLowerCase();

    /**
     * para que no incluya palabras repetidas
     */
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '6')
      .set('q', query);

      //console.log(params.toString())

    this.httpClient
      .get<SearchGifsResponse>(
        `${this.servicioUrl}/search`, {params: params}
      )
      .subscribe((resp) => {
        //console.log(res.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
