import { EventHandler, EventListener } from "./EventHandler";
import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { IRMCharacter } from "../views/UserListing";
import { defaultTheme } from "../providers/themeProvider";
import { Theme } from "@mui/material";


interface IGetSetValue<T>{
    set: (value: T) => void
    get: () => T
}

// export class GetSetValue<T> implements IGetSetValue<T> {
//     private value: T;
//     constructor(value: T){
//         this.value = value;
//     }
//     set(value: T){
//         this.value = value;
//     }
//     get(): T{
//         return this.value;
//     }
// }

export class StatefulStoreValue<T> implements IGetSetValue<T> {
  __type: string = "StatefulStoreValue";
  private value: T;
  private eventHandler: EventHandler<T> = new EventHandler<T>();
  static onValueChange: () => void = ()=>{};
  constructor(value: T){
    this.value = value;
  }
  set(value: T){
    this.value = value;
    this.eventHandler.emitEvent(value);
    StatefulStoreValue.onValueChange && StatefulStoreValue.onValueChange();
  }
  get(): T{
      return this.value;
  }
  addEventListener(func: (v:T) => void): EventListener {
    return this.eventHandler.addEventListener(func);
  }
}



const LocalStoreContext = React.createContext({});

const localStoreKey = 'assessment_store_123';

interface ILocalStoreProviderProps {
  children: ReactNode
}

function mapObject(obj: ILookupAny, func: (key:string, value:any) => any){
  Object.keys(obj).forEach((key: string) => {
    func(key, obj[key]);
  });
}


interface IStatefulStoreObject {
  [name:string]: StatefulStoreValue<any> // avoid nesting (for now)
}

export interface ILookup<T> {
  [name:string]: T
}

type ILookupAny = ILookup<any>

class StatefulStoreObject {
  static serialize(fromData: IStatefulStoreObject){
    const result: ILookupAny = {};
    mapObject(fromData, (k,v)=> {
      // if(typeof v == 'object' && v.constructor.name == "StatefulStoreValue"){
      if(typeof v == 'object' && v.__type == "StatefulStoreValue"){
        //of type 'StatefulStoreValue'
        // console.log("class type?", fromData[k]);
        result[k] = v.get();
      }else if(typeof v == 'object'){
        //object...recur
        result[k] = this.serialize(v);
      }
    });
    return result;
  }
  static deserialize(objToSet: IStatefulStoreObject, fromData: ILookupAny){
    mapObject(fromData, (k,v) => {
      // console.log("trying to set:", objToSet[k], objToSet[k].constructor.name);
      // if(typeof objToSet[k] == 'object' && objToSet[k].constructor.name == "StatefulStoreValue"){
      if(typeof objToSet[k] == 'object' && objToSet[k].__type == "StatefulStoreValue"){
        //of type 'StatefulStoreValue'
        // console.log("class type?", fromData[k]);
        objToSet[k].set(v);
      }else if(typeof fromData[k] == 'object'){
        //object...recur
        this.deserialize(objToSet[k], v); // recursion ommitted in TS (i.e. TS error is intentional)
      }
    });
  }
}


// function serialize(fromData){
//   const result = {};
//   mapObject(fromData, (k,v)=> {
//     if(typeof fromData[k] == 'object' && fromData[k].constructor.name == "StatefulStoreValue"){
//       //of type 'StatefulStoreValue'
//       console.log("class type?", fromData[k]);
//       result[k] = fromData[k].get();
//     }else if(typeof fromData[k] == 'object'){
//       //object...recur
//       result[k] = serialize(fromData[k]);
//     }
//   });
//   return result;
// }
// function deserialize(objToSet, fromData){
//   mapObject(fromData, (k,v) => {
//     // objToSet[k].set(v);
//     console.log("trying to set:", objToSet[k], objToSet[k].constructor.name);
//     if(typeof objToSet[k] == 'object' && objToSet[k].constructor.name == "StatefulStoreValue"){
//       //of type 'StatefulStoreValue'
//       console.log("class type?", fromData[k]);
//       // result[k] = fromData[k].get();
//       objToSet[k].set(v);
//     }else if(typeof fromData[k] == 'object'){
//       //object...recur
//       deserialize(objToSet[k], v);
//     }

//   });
// }

interface IAppSettings {
  useList: boolean
  themeName: ThemeName
}

export enum ThemeName {
  default = "default",
  rickNMorty = "rickNMorty",
}

interface IStoreData extends IStatefulStoreObject {
  // a: StatefulStoreValue<any> //for testing
  appSettings: StatefulStoreValue<IAppSettings>
  cachedCharacters: StatefulStoreValue<ILookup<IRMCharacter>>
}

const storeData: IStoreData = {
  a: new StatefulStoreValue(1),
  appSettings: new StatefulStoreValue<IAppSettings>({
    useList: true,
    themeName: ThemeName.default,
  }),
  cachedCharacters: new StatefulStoreValue<ILookup<IRMCharacter>>({}),
};

export function LocalStoreProvider({children}: ILocalStoreProviderProps){
  // const [hasLoaded, setHasLoaded] = useState(false);
  const [useValue, setUseValue] = useState<IStoreData | null>(null);
  // const value: IStatefulStoreObject = {
  //   a: new StatefulStoreValue(1),
  //   b: new StatefulStoreValue(2),
  // };

  const hasLoaded = useValue != null;

  let saveToLocalStore = () => {};

  useEffect(()=>{
    const storeRawData = window.localStorage.getItem(localStoreKey);

    if(window && window.localStorage){
      saveToLocalStore = () => {
        const jsonStr = JSON.stringify(StatefulStoreObject.serialize(storeData));
        // console.log("saving to localStore", storeData, storeData.a.get(), jsonStr);
        window.localStorage.setItem(localStoreKey, jsonStr);
      };
      StatefulStoreValue.onValueChange = () => saveToLocalStore();
      if(storeRawData == null){ // initialize
        saveToLocalStore();
      }else{//exists...get from localStore
        const jsonStr = window.localStorage.getItem(localStoreKey);
        // console.log("got data from localStore", jsonStr);
        if(jsonStr){//...shallow map
          const objTp = JSON.parse(jsonStr);
          StatefulStoreObject.deserialize(storeData, objTp);
          // console.log("deserialize?", storeData);
        }
      }
      // console.log("has loaded: value?", storeData, storeData.a.get());
      setUseValue(storeData);
    }
  },[]);

  if(!hasLoaded) return <div>Loading...</div>;

  return <LocalStoreContext.Provider value={useValue}>
      { children }
    </LocalStoreContext.Provider>;
}

export function useLocalStore(): IStoreData {
  return useContext<IStoreData>(LocalStoreContext);
}


export function clearLocalStore(){
  window.localStorage.setItem(localStoreKey, "");
}