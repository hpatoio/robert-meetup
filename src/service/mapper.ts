
import Meetup from '../model/meetup';

function mapToMeetup(data): [Meetup] {
    
    let meetups=data.map((datum, index)=>{
        return {
            id: index,
            title:datum.title,
            description:datum.body
        }
    });

    return meetups;

}

export default mapToMeetup;