class PlantClass {
    name: string;
    position: {x:number,y:number};
    id:number;
    boxId?: number;
    constructor(name:string, position:{x:number,y:number}, id:number,boxId?:number){
        this.id=id;
        this.name = name;
        this.position = position;
        if(boxId){
            this.boxId = boxId;
        }
    }
}
export default PlantClass;
