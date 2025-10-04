import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-white font-bold text-xl">YourApp</div>
          <div className="space-x-4">
            <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
            <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
              Sign Up
            </Link>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Your Workflow
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Streamline your process and boost productivity with our powerful platform.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50"
          >
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">Experience blazing fast performance with our optimized platform.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure by Design</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
              <p className="text-gray-600">Work together seamlessly with your team members.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}