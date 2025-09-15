'use client'

import Link from 'next/link'
import { ArrowLeft, Download, FileText } from 'lucide-react'

export default function ConstitutionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="flex items-center text-blue-100 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-blue-200 mb-4" />
            <h1 className="text-4xl font-bold mb-4">Constitution</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              The governing document of Boame Youth Empowerment LBG
            </p>
          </div>
        </div>
      </div>

      {/* Constitution Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Document Header */}
          <div className="bg-blue-50 p-8 border-b">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                CONSTITUTION OF BOAME YOUTH EMPOWERMENT LBG
              </h2>
              <div className="flex justify-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-8 prose prose-lg max-w-none">
            {/* Preamble */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                PREAMBLE
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We, the members of Boame Youth Empowerment LBG, having recognized the need to support and empower the youth through personal development, skill acquisition, and employment opportunities, do hereby establish this constitution to guide the operations and governance of the organization.
              </p>
            </section>

            {/* Article 1 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 1: NAME & STATUS
              </h3>
              <div className="space-y-4">
                <div>
                  <strong className="text-gray-900">1.1</strong> 
                  <span className="text-gray-700 ml-2">The name of the organization is Boame Youth Empowerment LBG (hereinafter referred to as "the Organization").</span>
                </div>
                <div>
                  <strong className="text-gray-900">1.2</strong> 
                  <span className="text-gray-700 ml-2">The Organization shall be a legally registered Limited by Guarantee (LBG) entity under the laws of Ghana.</span>
                </div>
                <div>
                  <strong className="text-gray-900">1.3</strong> 
                  <span className="text-gray-700 ml-2">The Organization shall be non-partisan, non-religious, and non-profit.</span>
                </div>
              </div>
            </section>

            {/* Article 2 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 2: VISION & MISSION
              </h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">2.1 Vision Statement</h4>
                <p className="text-gray-700 leading-relaxed italic bg-blue-50 p-4 rounded-lg">
                  To create a society where young people are equipped with the necessary skills and mindset to become self-sufficient, productive, and responsible citizens.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">2.2 Mission Statement</h4>
                <p className="text-gray-700 leading-relaxed italic bg-green-50 p-4 rounded-lg">
                  To empower Ghanaian youth through training, mentorship, education, and employment initiatives that promote self-development, entrepreneurship, and financial independence.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">2.3 Core Objectives</h4>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2">To provide mentorship and career guidance for junior high and senior high school students.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2">To offer training programs in personal development and skill acquisition.</span></li>
                  <li><span className="font-medium text-gray-900">c.</span> <span className="text-gray-700 ml-2">To facilitate job placement and entrepreneurship opportunities.</span></li>
                  <li><span className="font-medium text-gray-900">d.</span> <span className="text-gray-700 ml-2">To collaborate with stakeholders, including schools, government agencies, and corporate institutions, to support youth empowerment initiatives.</span></li>
                  <li><span className="font-medium text-gray-900">e.</span> <span className="text-gray-700 ml-2">To advocate for youth-friendly policies and programs that enhance economic participation and development.</span></li>
                </ul>
              </div>
            </section>

            {/* Article 3 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 3: MEMBERSHIP
              </h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">3.1 Eligibility</h4>
                <p className="text-gray-700 leading-relaxed">
                  Membership is open to individuals and organizations who share the vision and mission of the Organization and are willing to contribute to its success.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">3.2 Categories of Membership</h4>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2"><strong>General Members</strong> – Individuals committed to the objectives of the Organization.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2"><strong>Honorary Members</strong> – Individuals recognized for their exceptional contributions to youth development.</span></li>
                  <li><span className="font-medium text-gray-900">c.</span> <span className="text-gray-700 ml-2"><strong>Corporate Members</strong> – Organizations or institutions that support the Organization's goals.</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">3.3 Rights & Responsibilities of Members</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Attend meetings and participate in activities.</li>
                  <li>Vote on key issues (except honorary members).</li>
                  <li>Promote the Organization's interests and objectives.</li>
                  <li>Comply with the Organization's rules and regulations.</li>
                </ul>
              </div>
            </section>

            {/* Article 4 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 4: GOVERNANCE & LEADERSHIP
              </h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">4.1 The Board of Directors</h4>
                <p className="text-gray-700 mb-3">The Organization shall be governed by a Board of Directors comprising:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Chairperson</li>
                  <li>Vice-Chairperson</li>
                  <li>Executive Director (or President)</li>
                  <li>Secretary</li>
                  <li>Treasurer</li>
                  <li>Two (2) Additional Members</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">4.2 Responsibilities of the Board</h4>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2">Formulating policies and strategies for the Organization.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2">Overseeing financial management and accountability.</span></li>
                  <li><span className="font-medium text-gray-900">c.</span> <span className="text-gray-700 ml-2">Approving major projects and initiatives.</span></li>
                  <li><span className="font-medium text-gray-900">d.</span> <span className="text-gray-700 ml-2">Appointing and supervising the Executive Team.</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">4.3 The Executive Team</h4>
                <p className="text-gray-700 mb-3">The day-to-day operations of the Organization shall be managed by an Executive Team, including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Executive Director</strong> – Responsible for overall management and representation.</li>
                  <li><strong>Programs Coordinator</strong> – Oversees training and mentorship programs.</li>
                  <li><strong>Finance Officer</strong> – Manages financial records and reporting.</li>
                  <li><strong>Public Relations Officer</strong> – Handles communications and partnerships.</li>
                </ul>
              </div>
            </section>

            {/* Article 5 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 5: MEETINGS
              </h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">5.1 Types of Meetings</h4>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2"><strong>Annual General Meeting (AGM)</strong> – Held once a year to review progress, financial reports, and strategic plans.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2"><strong>Board Meetings</strong> – Held quarterly or as needed.</span></li>
                  <li><span className="font-medium text-gray-900">c.</span> <span className="text-gray-700 ml-2"><strong>Executive Meetings</strong> – Held monthly to discuss operational matters.</span></li>
                  <li><span className="font-medium text-gray-900">d.</span> <span className="text-gray-700 ml-2"><strong>Special Meetings</strong> – Convened as required for urgent issues.</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">5.2 Quorum & Decision-Making</h4>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2">A quorum for Board Meetings shall be at least two-thirds (2/3) of the members.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2">Decisions shall be made by a simple majority vote, with the Chairperson holding a casting vote in case of a tie.</span></li>
                </ul>
              </div>
            </section>

            {/* Article 6 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 6: FINANCE & ACCOUNTABILITY
              </h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">6.1 Sources of Funds</h4>
                <p className="text-gray-700 mb-3">The Organization shall raise funds through:</p>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2">Grants and donations from individuals, organizations, and government bodies.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2">Fundraising activities and sponsorships.</span></li>
                  <li><span className="font-medium text-gray-900">c.</span> <span className="text-gray-700 ml-2">Membership dues and contributions.</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">6.2 Financial Management</h4>
                <ul className="list-none space-y-3">
                  <li><span className="font-medium text-gray-900">a.</span> <span className="text-gray-700 ml-2">The Organization shall maintain a bank account at Guarantee Trust Bank Ghana (GTBank), with the Executive Director as the sole signatory.</span></li>
                  <li><span className="font-medium text-gray-900">b.</span> <span className="text-gray-700 ml-2">Financial records shall be audited annually and reported to members during the AGM.</span></li>
                  <li><span className="font-medium text-gray-900">c.</span> <span className="text-gray-700 ml-2">No funds shall be withdrawn without proper documentation and approval by the Board.</span></li>
                </ul>
              </div>
            </section>

            {/* Article 7 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 7: AMENDMENTS TO THE CONSTITUTION
              </h3>
              <div className="space-y-4">
                <div>
                  <strong className="text-gray-900">7.1</strong> 
                  <span className="text-gray-700 ml-2">Any proposed amendment to this constitution must be submitted in writing to the Board.</span>
                </div>
                <div>
                  <strong className="text-gray-900">7.2</strong> 
                  <span className="text-gray-700 ml-2">Amendments shall be discussed and approved by at least two-thirds (2/3) of the members present at an AGM or a special meeting convened for this purpose.</span>
                </div>
              </div>
            </section>

            {/* Article 8 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 8: DISSOLUTION
              </h3>
              <div className="space-y-4">
                <div>
                  <strong className="text-gray-900">8.1</strong> 
                  <span className="text-gray-700 ml-2">The Organization may be dissolved by a resolution passed by at least two-thirds (2/3) of the Board members at a special meeting.</span>
                </div>
                <div>
                  <strong className="text-gray-900">8.2</strong> 
                  <span className="text-gray-700 ml-2">Upon dissolution, any remaining assets shall be donated to a similar non-profit organization in Ghana, as determined by the Board.</span>
                </div>
              </div>
            </section>

            {/* Article 9 */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
                ARTICLE 9: ADOPTION
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                This Constitution was duly adopted on this [Date] by the founding members of Boame Youth Empowerment LBG and shall take effect immediately.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Signatories:</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">1. Chairperson –</span>
                    <div className="border-b border-gray-400 flex-1 h-6"></div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">2. Executive Director –</span>
                    <div className="border-b border-gray-400 flex-1 h-6"></div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">3. Secretary –</span>
                    <div className="border-b border-gray-400 flex-1 h-6"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}