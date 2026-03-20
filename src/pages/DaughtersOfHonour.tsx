import pImg from '../assets/doh.jpeg';
import outreachImg from '../assets/meal.jpg';
import encounterImg from '../assets/entry.jpg';
import prayImg from '../assets/pray.jpg';
import worshipImg from '../assets/worship.jpg';
import preachImg from '../assets/preach.jpg';

const DaughtersOfHonour = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fuchsia-600 mb-4">Daughters of Honour</h1>
        <div className="w-24 h-1 bg-fuchsia-400 mx-auto"></div>
      </header>

      {/* History Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Origin</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Daughters of Honour is conscious of the fact that women have a role to play in God's end time agenda for the church of Chirst whish is the reason
          why Global Flame has since the year 2012 organized an Annual Interdenominational Conference for women from all walks of life.
        </p>
        <h2>
          Daughters embark on a 21-day fasting and prayers period. The purpose of the fasting and prayers is to ensure that the conference is in conformity with
          the will of God. 
        </h2>
      </section>

      {/* Image Gallery */}
      <section>
        <h2 className="text-2xl font-semibold mb-8 text-gray-900 border-b pb-2">Moments in Ministry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
          {/* Card 1 */}
          <div className="group">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-lg bg-gray-100 mb-3">
              <img src={pImg} alt="DOH Meeting" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg text-gray-900">Annual Women's Conference</h4>
            <p className="text-gray-600 text-sm italic">A powerful gathering of women reflecting on the theme of grace.</p>
          </div>
          
          {/* Card 2 */}
          <div className="group">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-lg bg-gray-100 mb-3">
              <img src={outreachImg} alt="Outreach" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg text-gray-900">Community Outreach</h4>
            <p className="text-gray-600 text-sm italic">Sharing meals and the love of Christ with our local neighborhood.</p>
          </div>

          {/* Card 3 */}
          <div className="group">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-lg bg-gray-100 mb-3">
              <img src={encounterImg} alt="Encounter" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg text-gray-900">Prophetic Encounter</h4>
            <p className="text-gray-600 text-sm italic">Moments of deep spiritual breakthrough during our morning session.</p>
          </div>

          {/* Card 4 */}
          <div className="group">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-lg bg-gray-100 mb-3">
              <img src={prayImg} alt="Prayer" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg text-gray-900">Hour of Intercession</h4>
            <p className="text-gray-600 text-sm italic">Standing in the gap for families and our nation.</p>
          </div>

          {/* Card 5 */}
          <div className="group">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-lg bg-gray-100 mb-3">
              <img src={worshipImg} alt="Worship" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg text-gray-900">Night of Worship</h4>
            <p className="text-gray-600 text-sm italic">Lifting up our hearts in song and devotion.</p>
          </div>

          {/* Card 6 */}
          <div className="group">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-lg bg-gray-100 mb-3">
              <img src={preachImg} alt="Ministry Word" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-lg text-gray-900">Biblical Empowerment</h4>
            <p className="text-gray-600 text-sm italic">Gaining practical wisdom through the study of the Word.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default DaughtersOfHonour;