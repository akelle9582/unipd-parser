import { Injectable } from '@nestjs/common';
import * as request from 'request-promise';
import * as fs from 'fs';

@Injectable()
export class AppService {
  public readonly bookingEndPoint: String;

  constructor() {
    this.bookingEndPoint = 'http://www.gestionedidattica.unipd.it/PortaleStudenti/rooms_call.php';
  }

  private async wrapper(departmentCode: string): Promise<any> {
    const todayDate = new Date();

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: this.bookingEndPoint,
      json: true,
      formData: {
        'form-type': 'rooms',
        'sede': departmentCode,
        'data': todayDate.getDay() + '-' + todayDate.getMonth() + '-' + todayDate.getFullYear() //todo put in the constructor
      }
    };

    return new Promise(function (resolve, reject) {
      request.post(options, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    })
  }

  private async wrapperDate(departmentCode: string, date: string): Promise<any> {

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: this.bookingEndPoint,
      json: true,
      formData: {
        'form-type': 'rooms',
        'sede': departmentCode,
        'date': date
      }
    };

    return new Promise(function (resolve, reject) {
      request.post(options, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    })
  }

  public async root(codeDepartment: string, room: string) {
    const allUnipdRoomsWorld = await this.wrapper(codeDepartment);

    const tmp = allUnipdRoomsWorld.body.table[room].filter(el => el.id != undefined).map(el => {
      return {
        id: el.id,
        from: el.from,
        to: el.to,
        name: el.name,
        utenti: el.utenti
      }
    });

    return this.unique(tmp, 'id');
  }

  public async rootWithDate(codeDepartment: string, room: string, date: string) {
    const allUnipdRoomsWorld = await this.wrapperDate(codeDepartment, date);
    const tmp = allUnipdRoomsWorld.body.table[room].filter(el => el.id != undefined).map(el => {
      return {
        id: el.id,
        from: el.from,
        to: el.to,
        name: el.name,
        utenti: el.utenti
      }
    });

    return this.unique(tmp, 'id');
  }

  public async getRooms() {
    let rooms = [];
    const allUnipdRoomsWorld = await this.wrapper('0265-0260B-0260C');
    const unipdArea = allUnipdRoomsWorld.body.area_rooms;

    for (var p in unipdArea) {
      let dep = unipdArea[p];
      for (var prop in dep) {
        let room = dep[prop];
        rooms.push({
          id: room.room_code,
          name: room.room_name,
          department: p,
          address: room.address,
          departmentName: room.area
        })
      }
    }

    return rooms;
  }

  public async addHerokuApp(body) {
    const logStream = fs.createWriteStream('./list.txt', {'flags': 'a'});
    logStream.write('\n'+body.name);
    logStream.end();
  }

  private unique(array, propertyName) { //findIndex return only index of first el matched
    return array.filter((el, index) => array.findIndex(a => a[propertyName] === el[propertyName]) === index);
  }
}
