
import NavBar from "../Navbar/navbar";
import { Link } from "react-router-dom";


interface Quest {
 id: number;
 title: string;
 description: string;
}


const quests: Quest[] = [
 { id: 1, title: "Finding Nemo", description: "Dont ge eaten by sharks." },
 { id: 2, title: "Find the One piece", description: "Defeat sea emperors" },
];


export default function FavouritesPage() {

 return (
   <div className="favourites-page">
   <NavBar />
   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
       {quests.map((quest) => (
         <div
           key={quest.id}
           className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
         >
           <div>
             <h2 className="text-xl font-semibold text-gray-900 mb-2">
               {quest.title}
             </h2>
             <p className="text-gray-600 mb-4">{quest.description}</p>
           </div>
           <Link
             to={`/quests/${quest.id}`}
             className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
           >
             View Quest
           </Link>
         </div>
       ))}
     </div>
 </div>
 );
};
