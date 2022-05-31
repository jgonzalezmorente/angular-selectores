import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from '../interfaces/region.interface';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v2';
  private _regiones: Region[] = [
    { id: 'EU', description: 'European Union'}, 
    { id: 'EFTA', description: 'European Free Trade Association'}, 
    { id: 'CARICOM', description: 'Caribbean Community'}, 
    { id: 'PA', description: 'Pacific Alliance'}, 
    { id: 'AU', description: 'African Union'}, 
    { id: 'USAN', description: 'Union of South American Nations' }, 
    { id: 'EEU', description: 'Eurasian Economic Union'}, 
    { id: 'AL', description: 'Arab League'}, 
    { id: 'ASEAN', description: 'Association of Southeast Asian Nations' }, 
    { id: 'CAIS', description: 'Central American Integration System'}, 
    { id: 'CEFTA', description: 'Central European Free Trade Agreement' }, 
    { id: 'NAFTA', description: 'North American Free Trade Agreement'}, 
    { id: 'SAARC', description: 'South Asian Association for Regional Cooperation'}
  ];


  get regiones(): Region[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) {}

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const url: string = `${ this.baseUrl }/regionalbloc/${ region }?fields=name,alpha3Code`;
    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {

    if (!codigo) {
      return of(null);
    }
    const url = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais>( url );
  }

  
  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>( url );
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {
    if ( !borders ) {
      return of( [] );
    }

    // const peticiones: Observable<PaisSmall>[] = [];
    // borders.forEach( codigo => {
    //   const peticion = this.getPaisPorCodigoSmall( codigo );
    //   peticiones.push( peticion );
    // });

    const peticiones: Observable<PaisSmall>[] = borders.map( codigo => this.getPaisPorCodigoSmall( codigo ) );
    return combineLatest( peticiones );

  }

}
