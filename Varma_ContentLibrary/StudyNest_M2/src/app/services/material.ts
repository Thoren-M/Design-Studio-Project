import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MaterialData {
  title: string;
  course: string;
  content: string;
}

export interface Material extends MaterialData {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/materials';

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  createMaterial(material: MaterialData): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, material);
  }

  updateMaterial(
    id: string,
    material: MaterialData
  ): Observable<Material> {
    return this.http.put<Material>(
      `${this.apiUrl}/${id}`,
      material
    );
  }

  deleteMaterial(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}