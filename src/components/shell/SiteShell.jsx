"use client";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Home, FileText, Building2, Award } from "lucide-react";
import { COURSES_DATA } from "@/data/coursesData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CourseDetailModal } from "@/components/modals/CourseDetailModal";
import { EmiCalculatorModal } from "@/components/modals/EmiCalculatorModal";
import { ApplyOnlineModal } from "@/components/modals/ApplyOnlineModal";
import { BrochureModal } from "@/components/modals/BrochureModal";
import { LmsPortalModal } from "@/components/modals/LmsPortalModal";
import { HelpDeskModal } from "@/components/modals/HelpDeskModal";
import { CounselorModal } from "@/components/modals/CounselorModal";
import { TrackApplicationModal } from "@/components/modals/TrackApplicationModal";
import { SiteActionsContext } from "./SiteActionsContext";

const ROUTES = {
  home: "/",
  universities: "/universities",
  courses: "/universities",
  overview: "/universities",
  admission: "/universities",
  scholarships: "/universities",
  lms: "/universities",
  degrees: "/",
  compare: "/",
  nirf: "/universities",
};

export default function SiteShell({ children, universities = [] }) {
  const router = useRouter();
  const pathname = usePathname();

  const routeToTab = (path) => {
    if (path.startsWith("/colleges")) return "universities";
    if (path.startsWith("/universities")) return "universities";
    return "home";
  };

  const activeTab = routeToTab(pathname || "/");

  const scrollToHomeSection = useCallback((id) => {
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const setActiveTab = useCallback(
    (tab) => {
      router.push(ROUTES[tab] || "/");
      if (tab === "degrees") scrollToHomeSection("degrees");
      else if (tab === "compare") scrollToHomeSection("compare");
      else window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, scrollToHomeSection]
  );

  // Modals state
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyCourseId, setApplyCourseId] = useState("mba");
  const [emiPlanDetails, setEmiPlanDetails] = useState(null);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [emiCourseId, setEmiCourseId] = useState("mba");
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [selectedCourseForBrochure, setSelectedCourseForBrochure] = useState(null);
  const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);
  const [isHelpDeskModalOpen, setIsHelpDeskModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState(false);
  // The university of the page the visitor is on — the modals use it so they
  // never show another university's name.
  const [activeCollege, setActiveCollege] = useState(null);

  // Handlers
  const handleOpenCourseDetail = (course) => {
    setSelectedCourseForDetail(course);
  };

  const handleSelectCourseById = (courseId) => {
    const course = COURSES_DATA.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourseForDetail(course);
    }
  };

  const handleOpenApply = (courseId) => {
    if (courseId) {
      setApplyCourseId(courseId);
    }
    setEmiPlanDetails(null);
    setIsApplyModalOpen(true);
  };

  const handleOpenEmi = (courseId) => {
    if (courseId) {
      setEmiCourseId(courseId);
    }
    setIsEmiModalOpen(true);
  };

  const handleApplyWithEmi = (courseId, emiAmount, tenure) => {
    setApplyCourseId(courseId);
    setEmiPlanDetails({ emiAmount, tenure });
    setIsApplyModalOpen(true);
  };

  const handleOpenBrochure = (course) => {
    setSelectedCourseForBrochure(course || null);
    setIsBrochureModalOpen(true);
  };

  const actions = {
    onOpenApply: handleOpenApply,
    onOpenHelpDesk: () => setIsHelpDeskModalOpen(true),
    onOpenBrochure: handleOpenBrochure,
    onOpenEmi: handleOpenEmi,
    onOpenLms: () => setIsLmsModalOpen(true),
    onOpenCounselor: () => setIsCounselorModalOpen(true),
    onOpenTrack: () => setIsTrackModalOpen(true),
    onSelectCourse: handleSelectCourseById,
    setActiveCollege: setActiveCollege,
  };

  return (
    <SiteActionsContext.Provider value={actions}>
      <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#111c2d] font-sans pb-16 md:pb-0">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenApply={() => handleOpenApply()}
          onOpenHelpDesk={() => setIsHelpDeskModalOpen(true)}
          onOpenLms={() => setIsLmsModalOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          loggedInUser={loggedInUser}
        />

        <main className="flex-grow">{children}</main>

            <Footer
              setActiveTab={setActiveTab}
              onOpenApply={() => handleOpenApply()}
              universities={universities}
            />

        {/* Mobile Sticky Bottom Navigation Dock */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t border-[#e7eeff] px-3 py-2 flex items-center justify-around shadow-lg">
          <button
            onClick={() => {
              setActiveTab("courses");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "courses" ? "bg-[#e7eeff] text-[#115eaf]" : "text-[#43474d]"
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Courses</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "home" ? "bg-[#e7eeff] text-[#115eaf]" : "text-[#43474d]"
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("universities");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "universities" ? "bg-[#e7eeff] text-[#115eaf]" : "text-[#43474d]"
            }`}
          >
            <Building2 className="w-4 h-4 mb-0.5" />
            <span>Universities</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("admission");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "admission" ? "bg-[#e7eeff] text-[#115eaf]" : "text-[#43474d]"
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span>Admission</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("scholarships");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "scholarships" ? "bg-[#e7eeff] text-[#115eaf]" : "text-[#43474d]"
            }`}
          >
            <Award className="w-4 h-4 mb-0.5" />
            <span>Scholarship</span>
          </button>

          <button
            onClick={() => handleOpenApply()}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-bold bg-[#115eaf] text-white shadow"
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Apply</span>
          </button>
        </nav>

        {/* Modals Container */}
        <CourseDetailModal
          course={selectedCourseForDetail}
          college={activeCollege}
          isOpen={selectedCourseForDetail !== null}
          onClose={() => setSelectedCourseForDetail(null)}
          onOpenApply={(courseId) => {
            setSelectedCourseForDetail(null);
            handleOpenApply(courseId);
          }}
          onOpenBrochure={(course) => {
            setSelectedCourseForDetail(null);
            handleOpenBrochure(course);
          }}
          onOpenEmi={(courseId) => {
            setSelectedCourseForDetail(null);
            handleOpenEmi(courseId);
          }}
        />

        <EmiCalculatorModal
          isOpen={isEmiModalOpen}
          onClose={() => setIsEmiModalOpen(false)}
          initialCourseId={emiCourseId}
          onApplyWithEmi={handleApplyWithEmi}
        />

        <ApplyOnlineModal
          isOpen={isApplyModalOpen}
          college={activeCollege}
          onClose={() => {
            setIsApplyModalOpen(false);
            setEmiPlanDetails(null);
          }}
          preselectedCourseId={applyCourseId}
          emiPlanDetails={emiPlanDetails}
        />

        <BrochureModal
          isOpen={isBrochureModalOpen}
          college={activeCollege}
          onClose={() => setIsBrochureModalOpen(false)}
          selectedCourse={selectedCourseForBrochure}
        />

        <LmsPortalModal
          isOpen={isLmsModalOpen}
          college={activeCollege}
          onClose={() => setIsLmsModalOpen(false)}
          onOpenApply={() => {
            setIsLmsModalOpen(false);
            handleOpenApply();
          }}
        />

        <HelpDeskModal
          isOpen={isHelpDeskModalOpen}
          college={activeCollege}
          onClose={() => setIsHelpDeskModalOpen(false)}
        />

        <TrackApplicationModal
          isOpen={isTrackModalOpen}
          college={activeCollege}
          onClose={() => setIsTrackModalOpen(false)}
        />

        <CounselorModal
          isOpen={isCounselorModalOpen}
          onClose={() => setIsCounselorModalOpen(false)}
        />

        {/* Floating Bottom Action Buttons */}
        <FloatingActions
          onOpenCounselorModal={() => setIsCounselorModalOpen(true)}
          onOpenTrackModal={() => setIsTrackModalOpen(true)}
        />
      </div>
    </SiteActionsContext.Provider>
  );
}
