import { EventHandler, EventListener } from "./EventHandler";
import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { IRMCharacter } from "../views/UserListing";
import { defaultTheme } from "../providers/themeProvider";
import { Theme } from "@mui/material";


interface IGetSetValue<T>{
    set: (value: T) => void
    get: () => T
}

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
      if(typeof v == 'object' && v.__type == "StatefulStoreValue"){
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
      if(typeof objToSet[k] == 'object' && objToSet[k].__type == "StatefulStoreValue"){
        objToSet[k].set(v);
      }else if(typeof fromData[k] == 'object'){
        //object...recur
        this.deserialize(objToSet[k], v); // recursion ommitted in TS (i.e. TS warning is intentional)
      }
    });
  }
}

interface IAppSettings {
  useList: boolean
  themeName: ThemeName
}

export enum ThemeName {
  default = "default",
  rickNMorty = "rickNMorty",
}

interface IStoreData extends IStatefulStoreObject {
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
  const [useValue, setUseValue] = useState<IStoreData | null>(null);

  const hasLoaded = useValue != null;

  let saveToLocalStore = () => {};

  useEffect(()=>{
    const storeRawData = window.localStorage.getItem(localStoreKey);

    if(window && window.localStorage){
      saveToLocalStore = () => {
        const jsonStr = JSON.stringify(StatefulStoreObject.serialize(storeData));
        window.localStorage.setItem(localStoreKey, jsonStr);
      };
      StatefulStoreValue.onValueChange = () => saveToLocalStore();
      if(storeRawData == null){ // initialize
        saveToLocalStore();
      }else{//exists...get from localStore
        const jsonStr = window.localStorage.getItem(localStoreKey);
        if(jsonStr){
          const objTp = JSON.parse(jsonStr);
          StatefulStoreObject.deserialize(storeData, objTp);
        }
      }
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