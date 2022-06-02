import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Film } from '../dto/Film';
import { FilmService } from '../service/film.service';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit {

  selectedFilm?: Film;
  editMode: boolean;
  form!: FormGroup;
  title: string = window.location.href.split("/")[window.location.href.split("/").length - 1];

  constructor(private filmService: FilmService, private router: Router, private formBuilder: FormBuilder) {
    this.editMode = false;
  }

  ngOnInit(): void {
    this.filmService.getFilm(this.title).subscribe((data: HttpResponse<Film>) => {
      this.selectedFilm = data.body!;
    })
  }

  onEditChange() {
    if (this.editMode) {
      window.location.reload();
    }
    this.editMode = !this.editMode;
    this.form = this.formBuilder.group({
      title: [this.selectedFilm!.title],
      synopsis: [this.selectedFilm!.synopsis],
      poster: [this.selectedFilm!.poster],
      budget: [this.selectedFilm!.budget],
      release: [this.selectedFilm!.release],
      all_ages: this.selectedFilm!.all_ages,
      production: this.formBuilder.group({
        producer: this.selectedFilm!.production.producer,
        country: this.selectedFilm!.production.country,
      }),
      cast: this.formBuilder.array(this.selectedFilm!.cast),
      genres: this.formBuilder.array(this.selectedFilm!.genres),
    });
    // this.selectedFilm!.cast.forEach((cast) => {
    //   var group = this.formBuilder.group({
    //     actor: cast.actor,
    //     role: cast.role
    //   });
    //   this.form.controls['cast'].setValue(group);
    // })
    setInterval(()=> {
      var element = document.getElementById('poster') as HTMLElement;
      element.click();
    }, 1)
   
    
  }

  onArrayChanged(event: any) {
    var content = (event.target.value as string).split(',');
    var array = (this.form.controls['genres'] as FormArray)
    array.clear();
    content.forEach((item) => {
      if (item.startsWith(' '))
        item = item.slice(1);
      array.push(this.formBuilder.control(item));
    })
  }

  putFilm() {
    this.filmService.putFilm(
      this.title,
      {
        title: this.form.value.title,
        synopsis: this.form.value.synopsis,
        poster: this.form.value.poster,
        budget: this.form.value.budget,
        release: this.form.value.release,
        all_ages: this.form.value.all_ages,
        production: this.form.value.production,
        cast: this.form.value.cast,
        genres: this.form.value.genres,
      }
    ).subscribe(data => {
      Swal.fire({
        title: "La película se ha modificado con éxito",
        text: "Puedes consultarla de nuevo en la página de la película",
        icon: 'success',
        showConfirmButton: true,
        confirmButtonColor: "#1eb300",
        confirmButtonText: "Volver a la página de la película"
      }).then(() => {
        window.location.reload();
      })
    },
      (error: HttpErrorResponse) => {
        Swal.fire({
          title: "Se ha producido un error al actualizar la película",
          text: "Por favor, comprueba los datos suministrados e inténtalo de nuevo",
          icon: 'error',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: "Volver",
        })
      })
  }

  delete() {
    Swal.fire({
      title: "La película " + this.selectedFilm?.title + " se eliminará permanente",
      text: "¿Estás seguro de que deseas continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: "Eliminar película",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.filmService.deleteFilm(this.selectedFilm?.title!)
          .subscribe((response => {
            this.router.navigate(['']).then(() => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Película eliminada con éxito",
                showConfirmButton: false,
                timer: 1700
              })
            })
          }),
            (error: HttpErrorResponse) => {
              Swal.fire({
                title: "Se ha producido un error al borrar la película",
                text: "Por favor, inténtalo de nuevo más tarde",
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: "#1eb300",
                confirmButtonText: "Cancelar",
              })
            })
      }
    })
  }

  booleanChanged(value: boolean) {
    this.form.controls['all_ages'].setValue(value);
  }

  retrieveFormControls() {
    return this.retrieveFormArray().controls;
  }

  retrieveFormArray(): FormArray {
    var form = this.form.get('cast');
    return form as FormArray;
  }

  removePostFormArrayItem(idx: number) {
    (this.form.controls['cast'] as FormArray).removeAt(idx);
  }

  retrieveFormGroup(idx: number): FormGroup {
    var form = this.form.get('cast');
    if(form instanceof FormArray) {
      return form.at(idx) as FormGroup;
    } 
    return form as FormGroup;
  }

  addFormArrayItem() {
    var form = this.form.get('cast') as FormArray;
    var formGroup = this.formBuilder.group({});
    formGroup.addControl("actor", this.formBuilder.control(''));
    formGroup.addControl("role", this.formBuilder.control(''));
    form.push(this.formBuilder.group(formGroup.value));
  }

  onActorChange(idx: number, event: any) {
    var form = this.form.get('cast') as FormArray;
    var role = form.at(idx).value['role'];
    var auxForm = this.formBuilder.group({
      actor: event.target.value,
      role: role
    })
    form.at(idx).setValue(auxForm.value);
    this.form.get('cast')?.setValue(form.value)
  }

  onRoleChange(idx: number, event: any) {
    var form = this.form.get('cast') as FormArray;
    var actor = form.at(idx).value['actor'];
    var auxForm = this.formBuilder.group({
      actor: actor,
      role: event.target.value
    })
    form.at(idx).setValue(auxForm.value);
    this.form.get('cast')?.setValue(form.value)
  }

}
