// src/pages/Results.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mood } = location.state || { mood: "Relaxed" };
  const [selected, setSelected] = useState(null);

  const destinations = {
    Relaxed: [
      {
        name: "Kerala",
        img: "https://irisholidays.com/keralatourism/wp-content/uploads/2017/02/kerala-images-photos.jpg",
        desc: "Backwaters, Ayurveda, and the scenic Munnar hills.",
      },
      {
        name: "Goa (South)",
        img: "https://uploads-ssl.webflow.com/576fd5a8f192527e50a4b95c/5c0e6928a90b66f0a989c278_best%20beaches%20in%20goa%20for%20foreigners-min.jpg",
        desc: "Quiet beaches like Agonda and Palolem for peace.",
      },
      {
        name: "Pondicherry",
        img: "https://tse1.mm.bing.net/th/id/OIP.UQNgt7JuTCBxHp5-FsgFEwHaE8?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Beaches, Auroville, and French cafés.",
      },
      {
        name: "Mukteshwar (Uttarakhand)",
        img: "https://femina.wwmindia.com/content/2017/nov/mukteshwar_1511843782_1511843788.jpg",
        desc: "Serene retreats like Ranikhet and Mukteshwar.",
      },
      {
        name: "Sikkim",
        img: "https://www.sikkimtourismindia.com/blog/wp-content/uploads/2021/10/north-sikkim-tour-1024x576.jpg",
        desc: "Peaceful escapes at Pelling and Ravangla.",
      },
      {
        name: "Andamans",
        img: "https://tse2.mm.bing.net/th/id/OIP.uQ15bNCk-hYKFU3mlttDjwHaEZ?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Havelock & Neil Island for serene beaches.",
      },
      {
        name: "Tirthan Valley (Himachal)",
        img: "https://tse2.mm.bing.net/th/id/OIP.ZmBmS2JwBdE2_6K1ppjpIwHaEO?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Hidden gems like Tirthan Valley and Shoja.",
      },
    ],
    Adventurous: [
      {
        name: "Ladakh",
        img: "https://discoverlehladakh.in/wp-content/uploads/2020/02/all-you-want-to-know-about-leh-ladakh-1024x530.jpg",
        desc: "Biking, rafting, and Nubra Valley thrills.",
      },
      {
        name: "Spiti Valley (Himachal)",
        img: "https://wallpaperaccess.com/full/3511577.jpg",
        desc: "Bir Billing, Spiti Valley, Hampta Pass treks.",
      },
      {
        name: "Kedarkantha (Uttarakhand)",
        img: "https://cvsqtgaxsa.cloudimg.io/https://images.prismic.io/indiahike/be7dc2fa-5582-4bbd-ad9d-5e01670ec010_CLP+Program_Kedarkantha_Jothiranjan_2022_December_+%28272%29.jpg?w=2400&h=1600.5&q=50&org_if_sml=1",
        desc: "Kedarkantha, Valley of Flowers, rafting in Rishikesh.",
      },
      {
        name: "Meghalaya",
        img: "https://www.bontravelindia.com/wp-content/uploads/2023/02/Cherrapunji-Tourism-Nohkalikai-Falls-Cherrapunji.jpg",
        desc: "Caving, trekking, and stunning waterfalls.",
      },
      {
        name: "Tawang (Arunachal)",
        img: "https://4.bp.blogspot.com/-NDC5nUKY3RQ/WGyzxsWCnFI/AAAAAAAAAC8/lXmQ3sJ_VjAPjV5HJY3Xi32q9xZ_61RlwCLcB/s1600/Tawang1.jpg",
        desc: "Offbeat adventures in Tawang.",
      },
      {
        name: "Andamans",
        img: "https://hikerwolf.com/wp-content/uploads/2020/07/Andaman.png",
        desc: "Scuba diving & snorkeling paradise.",
      },
    ],
    Romantic: [
      {
        name: "Udaipur",
        img: "https://www.tripsavvy.com/thmb/saxdtK__W0j14gkQ2tEjjAkEB-Y=/2121x1414/filters:fill(auto,1)/GettyImages-956035876-76efc27d14d24032a3f3d1fcefdc4413.jpg",
        desc: "Lakes, boat rides, and palace hotels.",
      },
      {
        name: "Kashmir",
        img: "https://wallpapercave.com/wp/wp2874386.jpg",
        desc: "Gulmarg, Pahalgam, and houseboats.",
      },
      {
        name: "Manali & Solang",
        img: "https://i.redd.it/lbbeb4dhtqx01.jpg",
        desc: "Snowy stays & cozy hideouts.",
      },
      {
        name: "Kerala",
        img: "https://media.worldnomads.com/Explore/india/kerala-backwaters-canoe-istock.jpg",
        desc: "Houseboats, Alleppey, and Munnar tea gardens.",
      },
      {
        name: "Darjeeling",
        img: "https://www.tripsavvy.com/thmb/1EaTuaTDl2oJdPf_h6-1zCrPkmc=/2125x1411/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-498683275-5baa12584cedfd0025a79ace.jpg",
        desc: "Tea gardens & toy train rides.",
      },
      {
        name: "Goa",
        img: "https://tse3.mm.bing.net/th/id/OIP.Wd3iSc0Lq2D7GfB3R5aq8AHaE7?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Private resorts and romantic beaches.",
      },
    ],
    "Cultural & Heritage": [
      {
        name: "Rajasthan",
        img: "https://www.visittnt.com/blog/wp-content/uploads/2016/08/Jaisalmer.jpg",
        desc: "Jaipur, Jodhpur, and Jaisalmer forts.",
      },
      {
        name: "Madhya Pradesh",
        img: "https://static.toiimg.com/thumb/70192987/khajuraho.jpg?width=1200&height=900",
        desc: "Khajuraho & Mandu heritage wonders.",
      },
      {
        name: "Tamil Nadu",
        img: "https://tse4.mm.bing.net/th/id/OIP.xZ6dtsTQdjhbp0yBCu0O2gHaF7?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Madurai, Kanchipuram, Mahabalipuram.",
      },
      {
        name: "Odisha",
        img: "https://thumbs.dreamstime.com/b/emami-temple-second-jagannath-odisha-balasore-district-also-known-puri-170060514.jpg",
        desc: "Konark & Puri temples.",
      },
      {
        name: "Karnataka",
        img: "https://photographylife.com/wp-content/uploads/2015/07/DP2M0153c-1536x1024.jpg",
        desc: "Hampi ruins & Mysore palaces.",
      },
    ],
    Party: [
      {
        name: "Goa (North)",
        img: "https://www.traveltourguru.in/blog/wp-content/uploads/2022/11/New-Year-Rave-Goan-Rave-Parties.jpg",
        desc: "Baga, Anjuna, and crazy nightlife.",
      },
      {
        name: "Mumbai",
        img: "https://curlytales.com/wp-content/uploads/2019/07/IMG-1225.jpg",
        desc: "Nightlife & rooftop lounges.",
      },
      {
        name: "Bangalore",
        img: "https://res.cloudinary.com/https-highape-com/image/upload/q_auto:eco,f_auto,h_500/v1557821104/pthjiptyg6vpx167ghrw.jpg",
        desc: "Pubs, music & young vibes.",
      },
      {
        name: "Pune",
        img: "https://lh3.googleusercontent.com/NJzJ8GBB4PDpqzdEfLamzAmZK38vTxKDtfK4VQwwktovNTwuVREhGxtMcEQx_oilwhU0mjVIZ7kz9XRkTNc058RVHyLxRQEzXx41zHo=w900-rw",
        desc: "EDM festivals & nightlife.",
      },
      {
        name: "Kasol",
        img: "https://res.cloudinary.com/dwzmsvp7f/image/fetch/q_75,f_auto,w_1316/https://media.insider.in/image/upload/c_crop%2Cg_custom/v1541166341/ajphmsxf5m83t6gfxj0o.jpg",
        desc: "Music fests & café culture.",
      },
      {
        name: "Shillong",
        img: "https://blog.savaari.com/wp-content/uploads/2019/12/Shillong.png",
        desc: "Indie music & underground vibes.",
      },
    ],
    "Flower-Valleys": [
      {
        name: "Valley of Flowers, Uttarakhand",
        img: "https://www.trekupindia.com/wp-content/uploads/2022/06/towards-valley-of-flowers-1.png",
        desc: "Blooming alpine meadows in Uttarakhand’s UNESCO park.",
      },
      {
        name: "Yumthang Valley, Sikkim",
        img: "https://tse3.mm.bing.net/th/id/OIP.QhoK6GYn4ix5kC_8d11giQHaEQ?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Rhododendron sanctuary in North Sikkim.",
      },
      {
        name: "Khajjiar, Himachal Pradesh",
        img: "https://www.lifeberrys.com/img/article/fairytale-places-in-india-4-1658831574-lb.jpg",
        desc: "Mini Switzerland: meadows, forests, and alpine lake.",
      },
      {
        name: "Coorg, Karnataka",
        img: "https://karnatakatourism.org/wp-content/uploads/2022/10/Neelakurinji-2.jpg",
        desc: "Misty coffee estates and lush Nilgiri hills.",
      },
      {
        name: "Auli, Uttarakhand",
        img: "https://tse1.mm.bing.net/th/id/OIP.p_HJ8dvuOxR2Mny5fz7YWwHaE8?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Snowy skiing slopes and alpine vistas.",
      },
      {
        name: "Ooty, Tamil Nadu",
        img: "https://tse2.mm.bing.net/th/id/OIP.gdoDik1zziUEnwy_0IzWFwHaE9?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "Queen of Hill Stations with lush monsoon scenery.",
      },
    ],
  };

  const selectedPlaces = destinations[mood] || [];

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      <section className="px-6 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 
                       bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                       bg-clip-text text-transparent">
          Top {mood} Destinations in India
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {selectedPlaces.map((place, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelected(place)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 cursor-pointer border border-white/20 hover:border-cyan-400 transition"
            >
              <img
                src={place.img}
                alt={place.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{place.name}</h3>
              <p className="text-gray-300 mt-2">{place.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center p-6 z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white/10 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.img}
                alt={selected.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold">{selected.name}</h3>
              <p className="text-gray-300 mt-4">{selected.desc}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate("/trip-planner", {
                    state: { mood, destination: selected },
                  })
                }
                className="mt-6 px-8 py-3 rounded-full font-semibold 
                           bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 
                           shadow-lg transition duration-300"
              >
                Plan This Trip 🧳
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
