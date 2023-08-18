import { EventDataInterface } from './event-data';

export abstract class Receiver
{
    abstract receive(eventType:string,eventData:EventDataInterface);
}