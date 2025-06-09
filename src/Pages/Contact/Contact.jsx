import React from 'react'
import style from './Contact.module.css'
import { Heart, Award, Users, Shield, Pill, Clock, MapPin, ShoppingBag, CreditCard, Phone, Mail } from "lucide-react"
import { NavLink } from 'react-router-dom'

export default function Contact() {
  return (
    <>
      <div className="flex min-h-screen flex-col">

        <main className="flex-1 text-start">
          {/* Contact Us Section */}
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">Contact Us</h1>
                <p className="max-w-[700px] text-white md:text-xl/relaxed">We'd love to hear from you. Get in touch with our team.</p>
              </div>
            </div>
          </section>


          {/* information & form */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  ">
                <div className="lg:col-span-1 space-y-6 p-6 border-[#e5e5e5] rounded-lg ">

                  <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6 ">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 maincolor mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-gray-600 mt-1">
                          123 Smart Village, <br />
                          6th of October City, <br />
                          Giza, Egypt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 maincolor mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600 mt-1">
                          +20 100 000 0000 <br />
                          +20 111 111 1111
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 maincolor mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600 mt-1">
                          support@yourdomain.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 maincolor mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Working Hours</h3>
                        <p className="text-gray-600 mt-1">
                          Sunday - Thursday: 9:00 AM – 5:00 PM <br />
                          Friday & Saturday: Closed
                        </p>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-4">Follow Us</h2>
                    <div className="flex space-x-4 items-center text-center ">
                      <NavLink to="#" className="p-2 bg-gray-100  items-center flex justify-center  rounded-full hover:bg-teal-100 transition-colors">
                        <i className="fab fa-facebook-f h-5 w-5 maincolor"></i>
                      </NavLink>
                      <NavLink to="#" className="p-2 bg-gray-100  items-center flex justify-center   rounded-full hover:bg-teal-100 transition-colors">
                        <i className="fab fa-twitter h-5 w-5 maincolor"></i>
                      </NavLink>
                      <NavLink to="#" className="p-2 bg-gray-100  items-center flex justify-center   rounded-full hover:bg-teal-100 transition-colors">
                        <i className="fab fa-linkedin-in h-5 w-5 maincolor"></i>
                      </NavLink>
                      <NavLink to="#" className="p-2 bg-gray-100  items-center flex justify-center  rounded-full hover:bg-teal-100 transition-colors">
                        <i className="fab fa-instagram h-5 w-5 maincolor"></i>
                      </NavLink>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6 p-6 border border-[#e5e5e5] rounded-lg">
                  <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block font-medium text-[#374151]">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block font-medium text-[#374151]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block font-medium text-[#374151]">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block font-medium text-[#374151]">
                          Subject
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                          placeholder="Enter subject"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="block font-medium text-[#374151]">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="w-full border border-[#e5e5e5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        rows="6"
                        placeholder="Enter your message"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mainbgcolor text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* location */}

          <section className="w-full h-96 bg-gray-200 relative">
            {/* In a real app, you would integrate with Google Maps or another map provider */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <MapPin className="h-12 w-12 maincolor mx-auto mb-4" />
                <h3 className="text-xl font-bold">Our Location</h3>
                <p className="text-gray-600">123 Smart Village, 6th of October City, Giza, Egypt</p>
              </div>
            </div>
          </section>
          {/* Questions */}

          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter maincolor mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] mx-auto text-gray-600">
                  Find answers to common questions about Dwayee
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                {[
                  {
                    question: "How do I place an order on Dwayee?",
                    answer:
                      "To place an order, search for the medication you need, add it to your cart, and proceed to checkout. You'll need to provide your delivery address and payment information to complete the order.",
                  },
                  {
                    question: "Do I need a prescription to order medications?",
                    answer:
                      "Some medications require a valid prescription, which you'll need to upload during checkout. Medications that require prescriptions are clearly marked on the product page.",
                  },
                  {
                    question: "How long does delivery take?",
                    answer:
                      "Delivery times vary depending on your location, but typically orders are delivered within 1-2 business days in major cities like Cairo and Alexandria.",
                  },
                  {
                    question: "Can I return medications if I change my mind?",
                    answer:
                      "For safety and quality reasons, we generally do not accept returns on medications. However, if you receive damaged or incorrect items, please contact our customer service team within 24 hours.",
                  },
                  {
                    question: "How can pharmacies join the Dwayee platform?",
                    answer:
                      "Pharmacies can join by clicking on the 'Join as Pharmacy' button and completing the registration form. Our team will review the application and contact you to complete the onboarding process.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="p-6 rounded-xl border border-[#e5e5e5] rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-2 text-black">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>



        </main>
      </div>
    </>
  )
}
