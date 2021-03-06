import {ODataDto} from './odata-dto';
import {ODataModelInfo} from './odata-model-info';

export class GetResult<T extends ODataDto> {
  private data: Array<T>;
  public odataCount: number;
  constructor(json: any) {
    if (!isNaN(Number(json['@odata.count']))) {
      this.odataCount = Number(json['@odata.count']);
    }

    if (Array.isArray(json.value)) {
      this.data = json.value.map((o: any) => {
        return GetResult.convertODataInfo<T>(o);
      });
    } else {
      this.data = [];
      this.data.push(json.hasOwnProperty('value') ? json.value : json);
    }
  }

  count(): number {
    return this.data.length;
  }

  firstOrDefault(): T|null {
    if (this.count() > 0) {
      return GetResult.convertODataInfo<T>(this.data[0]);
    }
    return null;
  }

  toList(): Array<T> {
    return this.data;
  }

  static convertODataInfo<T>(item: any): T {
    if (item['@odata.type']) {
      if (!item._odataInfo) {
        item._odataInfo = new ODataModelInfo();
      }
      item._odataInfo.type = item['@odata.type'];
      delete item['@odata.type'];

      let parts = item._odataInfo.type.split('.');
      item._odataInfo.shortType = parts[parts.length - 1];
    }
    return item;
  }
}