import React, { useRef, useEffect, useState } from 'react'
import style from './About.module.css'
import placeholder from '@/assets/images/placeholder.svg';
import { Link, NavLink } from 'react-router-dom'
import ahmed from '@/assets/images/AHmed.jpg';
import abdallah from '@/assets/images/abdallah.avif';
import ali from '@/assets/images/Ali.png';
import hosam from '@/assets/images/hosam.svg';
import mohamedh from '@/assets/images/mohamedh.webp';
import mootaaz from '@/assets/images/mootaaz.avif';
import mohamed from '@/assets/images/mohamed.svg';
import shahd from '@/assets/images/shahd.jpg';
import sondos from '@/assets/images/sondos.svg';
import donia from '@/assets/images/donia.avif';

import { Heart, Award, Users, Shield, Pill, Clock, MapPin, Phone } from "lucide-react"
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function About() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [pharmacies, setPharmacies] = useState([]);
  const [randomPharmacyImage, setRandomPharmacyImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const getAllPharmacies = async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/pharmacies`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error........: ${res.status}`);
      const json = await res.json();
      console.log("All pharmacies:", json);
      const arr = json.data?.data || [];
      setPharmacies(arr);
      if (arr.length > 0) {
        const idx = Math.floor(Math.random() * arr.length);
        const randomPharmacy = arr[idx];
        const imageUrl =
          randomPharmacy.image || randomPharmacy.photo || placeholder;
        setRandomPharmacyImage(imageUrl);
      } else {
        setRandomPharmacyImage(placeholder);
      }
    } catch (err) {
      console.error("Failed to fetch pharmacies:", err);
      setRandomPharmacyImage(placeholder);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPharmacies();
  }, []);
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 text-start">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-500 to-teal-600 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-repeat opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M30 20h-4v4H10v12h16v4h4v-4h16V24H34v-4zm0 12h-4v-8h4v8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">About Dwayee</h1>
                <p className="max-w-[700px] text-white md:text-xl/relaxed">Egypt's First Dedicated Medication Platform</p>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter maincolor mb-6">Our Story</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Dwayee was founded in 2025 with a simple mission: to make healthcare more accessible to everyone in
                      Egypt. Our founders, a team of healthcare professionals and technology experts, recognized the
                      challenges that many Egyptians face when trying to find and purchase medications.
                    </p>
                    <p>
                      From long queues at pharmacies to the frustration of visiting multiple locations to find a specific
                      medication, the process was often time-consuming and inefficient. We believed there had to be a
                      better way.
                    </p>
                    <p>
                      That's why we created Dwayee - a platform that connects patients with pharmacies, making it easier
                      to find, compare, and order medications from the comfort of your home. Our name, "Dwayee" (دوائي),
                      which means "my medicine" in Arabic, reflects our commitment to personalizing the healthcare
                      experience for every Egyptian.
                    </p>
                  </div>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <img
                    src={randomPharmacyImage}
                    alt="Dwayee Team"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-teal-100 rounded-full mr-4">
                      <Heart className="h-6 w-6 maincolor" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-gray-600">
                    To revolutionize access to medications in Egypt by creating a seamless digital platform that connects
                    patients with pharmacies, ensuring everyone can find and receive the medications they need quickly and
                    efficiently.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-teal-100 rounded-full mr-4">
                      <Award className="h-6 w-6 maincolor" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-gray-600">
                    To be the leading healthcare platform in Egypt and the Middle East, known for our reliability,
                    accessibility, and commitment to improving healthcare outcomes through technology and innovation.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter maincolor mb-4">Our Values</h2>
                <p className="max-w-[700px] mx-auto text-gray-600">
                  The principles that guide everything we do at Dwayee
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="p-3 bg-teal-100 rounded-full w-fit mb-4">
                    <Users className="h-6 w-6 maincolor" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Patient-Centered</h3>
                  <p className="text-gray-600">
                    We put patients at the center of everything we do, designing our platform to meet their needs and
                    improve their healthcare experience.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="p-3 bg-teal-100 rounded-full w-fit mb-4">
                    <Shield className="h-6 w-6 maincolor" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trust & Safety</h3>
                  <p className="text-gray-600">
                    We maintain the highest standards of safety and security, ensuring that all medications are sourced
                    from licensed pharmacies.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="p-3 bg-teal-100 rounded-full w-fit mb-4">
                    <Pill className="h-6 w-6 maincolor" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                  <p className="text-gray-600">
                    We believe that everyone should have easy access to the medications they need, regardless of where
                    they live in Egypt.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter maincolor mb-4">Our Team</h2>
                <p className="max-w-[700px] mx-auto text-gray-600">Meet the dedicated professionals behind Dwayee</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                {[
                  {
                    name: "Ahmed Hisham",
                    role: "Back End Developer",
                    image: ahmed,
                  },
                  {
                    name: "Mohamed Hisham",
                    role: "Back End Developer",
                    image: mohamed,
                  },
                  {
                    name: "Motaz Mohamed",
                    role: "Back End Developer",
                    image: mootaaz,
                  },
                  {
                    name: "Hossam Mogahed",
                    role: "Business",
                    image: hosam,
                  },
                  {
                    name: "Ali Hawas",
                    role: "",
                    image: ali,
                  },
                  {
                    name: "Mohamed Hassan",
                    role: "Front End Developer",
                    image: mohamedh,
                  },
                  {
                    name: "Abdallah Khadari",
                    role: "Front End Developer",
                    image: abdallah,
                  },
                  {
                    name: "Maram Mahmoud",
                    role: "Front End Developer",
                    image: sondos,
                  },
                  {
                    name: "Shahd Ramadan",
                    role: "Front End Developer",
                    image: shahd,
                  },
                  {
                    name: "Donia Abd El-Nasser",
                    role: "Flutter",
                    image: donia,
                  },
                  {
                    name: "Sondos Ali",
                    role: "Tester",
                    image: sondos,
                  },
                ].map((member, index) => (
                  <div key={index} className="text-center w-full max-w-[250px]">
                    <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                      <LazyLoadImage src={member.image || placeholder} alt={member.name} className="object-cover w-full h-full" />
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-16 mainbgcolor text-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <p>Pharmacies</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <p>Medications</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">50,000+</div>
                  <p>Customers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <p>Cities Covered</p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter maincolor mb-4">Get in Touch</h2>
              <p className="max-w-[600px] mx-auto text-gray-600 mb-8">
                Have questions about Dwayee? We'd love to hear from you. Contact our team for more information.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className="flex items-center justify-center">
                  <Phone className="h-5 w-5 maincolor mr-2" />
                  <span>+20 123 456 7890</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-5 w-5 maincolor mr-2" />
                  <span>Cairo, Egypt</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="h-5 w-5 maincolor mr-2" />
                  <span>9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
