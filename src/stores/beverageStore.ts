import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  addDoc,
  query,
  QuerySnapshot,
  QueryDocumentSnapshot,
  where,
  onSnapshot,
  CollectionReference,
} from "firebase/firestore";
import {
  User,
} from "firebase/auth";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
    beverageListener: null as (() => void) | null,
    message: "",
  }),

  actions: {
    init() {
      const myBasecollection: CollectionReference = collection(db, "bases");
      getDocs(myBasecollection).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const baseData = qd.data() as BaseBeverageType;
          this.bases.push(baseData);
        })
        this.currentBase = this.bases[0];
      });
      const myCreamercollection: CollectionReference = collection(db, "creamers");
      getDocs(myCreamercollection).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const creamerData = qd.data() as CreamerType;
          this.creamers.push(creamerData);
        })
        this.currentCreamer = this.creamers[0];
      });
      const mySyrupcollection: CollectionReference = collection(db, "syrups");
      getDocs(mySyrupcollection).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const syrupData = qd.data() as SyrupType;
          this.syrups.push(syrupData);
        })
        this.currentSyrup = this.syrups[0];
      });
      this.message = "Please sign in to create and view your beverages.";
    },

    setUser(user: User | null) {
      if (user == null) {
        this.message = "Signed out successfully.";
      }
      else {
        this.message = `Signed in with Google.`;
      }

      if (this.beverageListener) {
        this.beverageListener();
        this.beverageListener = null;
      }

      this.user = user;
      this.beverages = [];
      this.currentBeverage = null;
      this.currentBase = this.bases[0];
      this.currentCreamer = this.creamers[0];
      this.currentSyrup = this.syrups[0];
      this.currentTemp = this.temps[0];

      if (!user) {
        return;
      }

      const bevColl = query(collection(db, "beverages"), where("id", "==", user.uid));

      this.beverageListener = onSnapshot(bevColl, (s: QuerySnapshot) =>  {
        for (let change of s.docChanges()) {
          const bevData = change.doc.data() as BeverageType;
          if (change.type === "added") {
            this.beverages.push(bevData);
          }
        }
        if (this.beverages.length > 0 && this.currentBeverage == null) {
          this.currentBeverage = this.beverages[0];
          this.showBeverage();
        }
      })
    },


    makeBeverage() {
      if (this.user == null) {
        this.message = "No user logged in, please sign in first.";
        return;
      }
      else if (this.currentBase == null || this.currentCreamer == null || this.currentSyrup == null  || this.currentTemp == null || this.currentName == "") {
        this.message = "Please complete all beverage options and the name before making a beverage.";
        return;
      }
      else {
        const newBev: BeverageType = {
          id: this.user.uid,
          name: this.currentName,
          temp: this.currentTemp,
          base: this.currentBase,
          syrup: this.currentSyrup,
          creamer: this.currentCreamer,
        };
        const bevColl: CollectionReference = collection(db, "beverages");
        addDoc(bevColl, newBev).then(() => {
          this.currentBeverage = newBev;
          this.message = `Beverage ${this.currentName} created successfully!`;
        });
      }
    },

    showBeverage() {
      if (this.currentBeverage != null) {
        this.currentBase = this.currentBeverage.base;
        this.currentCreamer = this.currentBeverage.creamer;
        this.currentSyrup = this.currentBeverage.syrup;
        this.currentTemp = this.currentBeverage.temp;
      }
    },
  },
});
