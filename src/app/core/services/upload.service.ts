import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class UploadService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.apiUrl}/Upload/upload`, formData);
    }

    getFile(fileKey: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Upload/GetFile/${fileKey}`);
    }
}