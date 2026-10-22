"use client";
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
const PAGE_SIZE = 3;
export const BlogsListSection = ({ onOpenHelpDesk, title, className = 'bg-white rounded-xl border border-[#c4c6ce]/60 shadow-sm p-5 md:p-7', sectionId = 'blogs', posts: passedPosts, }) => {
    const posts = passedPosts ?? [];
    const [shown, setShown] = useState(PAGE_SIZE);
    return (<section id={sectionId} className={`${className} scroll-mt-[130px]`}>
      <h2 className="text-2xl font-bold text-[#000f22] tracking-tight mb-4">
        {title ?? 'Blogs'}
      </h2>

      <ul className="grid gap-3 list-none">
        {posts.slice(0, shown).map((post, i) => (<li key={i}>
            <a href="#" onClick={(e) => {
                e.preventDefault();
                onOpenHelpDesk();
            }} className="group flex gap-3 p-2.5 border border-[#e7eeff] rounded-xl bg-white hover:border-[#c9d6e0] hover:shadow-[0_2px_8px_rgba(15,58,92,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115eaf] focus-visible:ring-offset-2 transition-all">
              <div className="flex-none w-[112px] h-[84px] rounded-lg overflow-hidden bg-gradient-to-br from-[#e7eeff] to-[#d5e3ff] flex items-center justify-center text-[#0b2540] font-semibold text-xs text-center p-1.5">
                {post.image ? (<img src={post.image} alt="" loading="lazy" className="w-full h-full object-cover block"/>) : ('Blog')}
              </div>

              <div className="min-w-0 flex flex-col justify-between py-0.5">
                <h3 className="text-sm font-medium leading-snug text-[#115eaf] line-clamp-3 group-hover:underline">
                  {post.title}
                </h3>
                <span className="flex items-center gap-1.5 text-xs text-[#74777e] mt-1.5">
                  <Clock className="w-3.5 h-3.5"/>
                  {post.date}
                </span>
              </div>
            </a>
          </li>))}
      </ul>

      {shown < posts.length && (<button type="button" onClick={() => setShown(posts.length)} className="block mx-auto mt-5 h-11 px-5 rounded-lg border border-[#0b2540] bg-white text-[#0b2540] text-sm font-medium hover:bg-[#f0f6fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115eaf] focus-visible:ring-offset-2 transition-colors cursor-pointer">
          View More
        </button>)}
    </section>);
};
