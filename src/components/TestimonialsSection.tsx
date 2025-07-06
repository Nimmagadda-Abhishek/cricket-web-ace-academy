
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Testimonials from './Testimonials';
import { supabase } from '@/integrations/supabase/client';

// Custom CSS for scrollbar hiding
const scrollbarHideStyles = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
  '&::-webkit-scrollbar': {
    display: 'none'
  }
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [useDynamicTestimonials, setUseDynamicTestimonials] = useState(false);
  
  // Check if we have testimonials in the database
  useEffect(() => {
    const checkTestimonials = async () => {
      try {
        const { count } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
        
        setUseDynamicTestimonials(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking testimonials:', error);
        setUseDynamicTestimonials(false);
      }
    };
    
    checkTestimonials();
  }, []);
  
  const testimonials = [
    {
      name: 'Rajnikanth Reddy',
      role: 'Parent',
      content: 'Joined my kid in Kalyan Cricket Academy for a month while we were on vacation in India. Have to say the facility and coaching is really good. The coaches were very helpful in identifying any flaws with technique and correct them to improve his shot making, bowling and fielding. Would highly recommend it if you are looking for a cricket academy.',
      rating: 5,
      image: '/images/testimonials/testimonial1.jpg',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'D. Sai Jayanth',
      role: 'Student',
      content: 'KCA is one of the best cricket academy in Hyderabad. I have visited the place, coaches are really good, they focus on each and every player and teach discipline along with the game. If you have a good talent and wants to do more in cricket, you must join Kalyan cricket academy go visit the place and see for yourself.',
      rating: 5,
      image: '/images/testimonials/testimonial2.jpg',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Nishkala Donthireddy',
      role: 'Student',
      content: 'The academy boasts a team of experienced coaches who have played at the highest levels of the game. The academy\'s infrastructure is top-notch, with well-maintained pitches, practice nets, and fitness areas. The coaching experience at this Cricket Academy is exceptional, Whether am beginner the coaching here is top level.',
      rating: 5,
      image: '/images/testimonials/testimonial3.jpg',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Academy Student',
      role: 'Elite Program',
      content: 'KCA is more than just a coaching center; it fosters a community of students, coaches, and parents working together to develop skilled cricketers. The academy aims to identify talented individuals passionate about cricket and offers them the necessary support and guidance to excel at various levels.',
      rating: 5,
      image: '/images/testimonials/testimonial4.jpg',
      color: 'from-red-500 to-orange-600'
    },
    {
      name: 'Arjun Sharma',
      role: 'Professional Player',
      content: 'I credit my professional career to the foundation I received at Kalyan Cricket Academy. The technical training and mental conditioning prepared me for the highest levels of competition. The coaches here don\'t just teach cricket, they instill a winning mindset and professional approach to the game.',
      rating: 5,
      image: '/images/testimonials/testimonial5.jpg',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      name: 'Priya Patel',
      role: 'Parent of Junior Player',
      content: 'My daughter has transformed since joining KCA. Not only has her cricket improved dramatically, but she\'s also developed discipline, teamwork, and confidence that extends beyond the field. The coaches create a supportive environment where young players can thrive and develop their skills at their own pace.',
      rating: 5,
      image: '/images/testimonials/testimonial6.jpg',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      name: 'Vikram Mehta',
      role: 'Corporate Program Participant',
      content: 'Our company enrolled in the corporate cricket program as a team-building activity, and it exceeded all expectations. The professional coaching combined with the fun, competitive atmosphere helped strengthen our team bonds while providing a great workout. Highly recommended for corporate groups!',
      rating: 5,
      image: '/images/testimonials/testimonial7.jpg',
      color: 'from-indigo-500 to-violet-600'
    },
    {
      name: 'Kiran Kumar',
      role: 'Advanced Training Student',
      content: 'The personalized coaching at KCA helped me overcome specific technical issues that had been holding back my game for years. The video analysis sessions and targeted drills made a huge difference. Within months, I saw improvements that years of casual practice couldn\'t achieve.',
      rating: 5,
      image: '/images/testimonials/testimonial8.jpg',
      color: 'from-rose-500 to-pink-600'
    }
  ];
  
  // Simple auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000); // Change testimonial every 3 seconds
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // No need for manual scrolling as we're using CSS transform now
  
  // Touch swipe functionality
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left, go to next
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
    
    if (touchStart - touchEnd < -100) {
      // Swipe right, go to previous
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const galleryImages = [
    { 
      title: 'Indoor Training Session', 
      category: 'Training', 
      image: 'data:image/webp;base64,UklGRvQjAABXRUJQVlA4IOgjAADwxACdASqLAQYBPp1InkulpCa0pZWqcpATiWNukxfxqx6bD9ffDkWy0S3WZJjG+ypba+pdTMeOjrV/ezhS4SGQ6zlNv9fyKPyPqH8Xj9s9Q8juvYg2vOtm2FtgF/+ml2O69q0xt/bYiqDSDMzBiD6J02HFZfm+Px/REEEDdVl/Z0RlFDK67e9v/N45EBHeMSC/zx3Kmi6Nl5arAJPjc1aq0myY/iWhc0CekMSv0myj6AwHh8IF2fj2lKUab+cwzI54jx+7r7pEWzTEPsYEPP6aaaZdAv3aoyRukfkA25u3E5v/PGr0vPMhMFTJX5K02DPQI4FU0NP6noMPWdhhHOa8v8/HljxL5ed5EyNYx7ozKdtqT7SBz2swQyayTQZCNisZiNXbFaQXupowjnXJkEU1YCnGQZy6Wo6WlQSLsi3dipeijXET4cct9XGbeoZubKxdsh8UGBwy5LmvI/jrGV+u/O5rPDK8Zh8nXlpCHQQPA2QtwuxzetqoI3DSAZtND4aVjwRAedXYFFywyuft3mFH9B3dNpNoKFXo4PYpxgq1JxlIicDfGDL2RepG2MWpeOxTDyTdwMSeK3NJqdZiKJyhivNArNwsj01qLUVGVK4N8zK/wn4PybbU4vF5e0VZjmoZ/UlneMhNWT47KOtRtXCIESz6CiwWgfRV73COtISmx3XxkVSFbvaZu4aej5hQpLDmItWXP0WwLs5L8b3G14WIO7X0PK5d8vt8eC6xVQQWhnvBgoP3GM4pf3YOsjOYG58kFt+oPbqAIgLZj4LBKdtK48esTUgnWKF/hSK3qS70mzHDfChXuHCxpUuKGg+cJfZPcC38OY7AI4AkCxK8tVxvpK1w8m9gZj4Fr8NlLySs2duissUeH4JAxST1uT3bydw9/e9SNR2jeIoEUFGlvyo2kSMaHCoqvFtGGMgvwOvRoJyOho3FOCTviDq8tYXieOPYCL0kmXwXHDnwxp6SvD9OLCKHYHkhQWv5Uwfx5n5v3ZaBIHzT2TT4KoaguAq2oIn+5oSbOLpIv96jUS87JixPNXQofrU4UIyTIz98CO85XwISSJ4/4dNtyqmqQboZ31Ya9yYqbN7AQDGosoyxjKyN1u7tRfBXLR/cNhUPLlOdlzbBUQusf9sIAYeNnih4NS4gH90H0HOQWbZafLp8P5FrGywHVoPtyxQUxmcm0TVx0wOyxn4zLHcp8tuCjEjRVIuBYhDNzvpopr0XRK21CnA1FHiCBrLlonobvjj9x8BibMuQa50wDRbCaQ20P+yymRtbnAAhR9vv1dOfG7Su1KiaVxzBtOg1jJbDWNWdbhYAm0o1IszhCW38ftxsLIbvA7G/s+uMw9rdcyjmm7xNJv/U/yaFEei3/L8XK50L80Yv/9S3bDBc9QxblNsWhSlhMFAk+ZpXg2bRMz+7tWjoukikVLq27YNGNgtOnDMkDGqtoTH4//ztZaOhGYmRlBXCp64lKiXH1wilQRPFFZ4ms2ZuTWugbtBswTaCI/688xCBFp8igBXPYddtepL4CbZZtcUqDJ4TrjgGqKqtnZshlfV9UqYaGBL25SJe8YLoIWrayROaDWuysZHpBEyXiW5OCSfqdQF8I8GqLHOBU5K7Rd8RSJhV8ToP1FSmh/6fBHEsC3lPlKvVR1uiDXRR6wfd2O/XHHTj42Au3zaMNuHhOK4jjyZ/041LM7moKR+kl8l/ldYiznn8L/P5ZsERvNjMrKTwYaylx3jC4Vd5BHHMl0qTphaflQMNmKYgoBBoWZrg7sJNkMXmDCiszrvl6lgTIVcwIJ2HgtWNj8N9QwWIouShvWXIVewd/tZ2Aass2t8NtZyyUF+eSvzMByjGbIMAItIx0AfkuyWXwOw6ZWwcgw6ZKaSEDhijyBRFVBSgVY/wtu6ICmdmUYra7socANHT2FAK1+0j3Qq782ffEs1QPPQQXw1OhLr5So8AOBnBaUL63Mi+vSP5DA65ZNePHb0SrXkKRMcKxbf5jO7VyljKkT0+paxIj8Hv/p0W5zA1E+NiZrDV+F8dG/AtZMKegA+x38nAnvduwbnnnZmlYiD9D8wbs6qQTcw9CpSJRX2BKO2o72U+oiuwiCLjW6VW7Env0AAA/u5hX4nf/5+Z/+d//O/Xr4NTckr8xp2Bh6cXdLeG48OK3RhFj9NCEmTmuQjk7twW3L4YsHDTk995KK3tjqKtoHBbSot/WUxJviKv5bn2ZpJE0sXaklOQbVToaKM+UEhRUMmxYGMR4RkSSv4qhgLw4cIB6nMyQofkW4vu/7ICaluoiD/R4W9dqz/xAEnFC48PIhfh2YjwdgFnQbej8KpIbUQOLmBRPJIAbALcqyV/1fjOwTPKImjWWe2oN6VShjSGuIX2n6C8kVgKqCCVwAg09fuohywpgClwofnV2GMKLtUAvDHLHUHuBrx9q2bbTuRV29N4JBfgV57zx3W1gZd1hhuL92k9xHO6PZgFbUnCtyn1Uy6A5C4HXkp41Gdzet0hgunhXh03E7CZfkD6yZxvCw+Jb2iw3UNVaIsVtRMwuGBpaDcX6/srL1hv+39tt7zuSanthYXjztHQeZK8LG+kDB4906dLXjpxnhzm9o8NMY0+MJkEK3T69d2yEIa3trWlBoJfCQHt82wOGPELmbAD8Z25XIpZUJfqMMsqXrEKGCuDYJiE3mRLnJCB//F85kR216lgZ7dcGJPO8c7bu9S6zhHX6cmvHW7gPH8XiOJb5HiKloEe6mYsyJX5KRIerzNJFbQVYapDAah2SR4EVcMoAxiBASy7fvHdlnAleTIRq5LuQMuhcVKjvTQ1omFVJTQz2LTseX00xeWvQTdiLzNFi9nnhoBkRsh0Z1phhVewni9JbhL1bLSzOb1wirUF/Xi6jKRsEeef0AAhpQUjTVXHw74WawvVre++2U7Mbczy58dsD2ResBGs8XrbfPCYR7/TlfNjzgkrM2K9Sv3pSt31jfB86XsiIFyymTZ4Y0enyiZjn1I85NCgJAgIoLNI2flJ2HUqlgMjOltWxWCLVNwKfr7OmF2d9wkoN2dronKc/g2JhJPFT9jCDxuw4kHnd0uhhN+VeCwgrfk5iKzwGFRoFZCogBkLzBV+1XsC5uT5GQjD2msiII/8yWjXAXGQ/IQ7Axb++UIkJN7R5jvl95AiNdSzqWG71X9y85cbNGI8l3Wb2u+Fn8UYgzDkaMNWhsfyxEy9FV0jeSZnk2NO7rkulx7jiUHa+uEMWbxdYJ5xeyOvjvj2WLFYTzN2MerEIK97DsVMuRznQX3p5A3ktbzEldswxQ7Vj+TNf93Mz50t2ZZwD35R1fPwlOyKeiSd0E9eM0b0/Q6Fb6n1ryLNl4tXzK/ECbMsxGdLPTyugoEPssfCv+X4f/8ZPr1rMGf7efIENeZ13x1C+FOTAfYbEYqSaZ15biIdH6QgwZXQuzIOFdRt+zVqbAtdni8xkQEvS6uDtwCRNBFGQWgB6WCDn23huZm8wv5E0Ya5rXkg0cZ1t4dFPbtSThFloqDbfq0/4xNpMsxY2ssVLkWNEa9gncgSy43vw2EY7xlvLzBAZas2dd+ObCul2krYARkaS1vIpd/JSMBqv5pHdmvD8i9bq6fqZPRPok6YR/Otx2l8TrmM7qsgMh3SqZw4gG1vqDij31Cvu6Xbf62w05qTPxdmLkjdXrfoJdki3X77+xcsShta3Ghs6DvysWUBbwUlYDYmcjBXX+AJ9d+FZXrJNOSTiJEGRK7a4NGouh6MLY7taRgmSL+zeQJCnJvAugNJGVocoHAn7hvVQK9jXZ7vVDwTaJ/T+49mZtiAGv/SP6kxT4sF09M51AjDwXVArkrZbpLLmZ6U0qu9CQj86IP/KDLLiJWvvbgaaY2F5Jt3pBVxB75il/Beognueq6aDlLi7cCZqkSlSZMoHX5xMHU79CAtutH95ibFBOKVcn0pyFPQc/YuZgxv0fOfBWYq7CPqWCb0tFQV0JNomTDqw2Gh2NcKaoffy/Fa/fHY7LTBEVfgIV/vnS+VXDsjX3Odsb0pc2hkYO+uPtW8iX2TP8xMx6xJ3lJIoY+O2lFo8iTs13kminvNi4GhWem61Z6ubeK/qj1ru8NpOkupUro8R85GXDXwzjZMLsLswv3Dxao9gNf00p0KhDflmcH8RVFzdTa6keT1s6H4N3D7HTpKj5pzJws+/hR/0gXN/Je5m6crCR7Zc2Y8bt4tTnhAExyzDSup4ee0DZmnazd1XAwfEVOw4nYNOwUejQC5aV8BUGpQ0XFq/C92eGyXhC3sT6x3/3WgdtbVKHoBeP2sbusrkSQGmwPJIjRya3Jz6MJBF9rtjyWCftknQT85CcJ6i73bSobVkksIlbptM1Vn6oO97MeBkAVRf7Kn6qGB/iECKZoWlTizhUcwlMgvBy2I1zlIzukauvro8P2SIKHwB2efYgv9PupbE1K07fooofDt7KhWktOiG2t1UR+dCcTf33r8aBqZuijLottmDZ5B3Wp+LzZ7n3m+QPoulr6BNXeDA/wBqCSaotKpLV+9WtQHXbGshaixajfkqfKC9znq5k7h32Eo1IghY/bxpv769TAZn25UqqeUtYxm3qw8C6hd7+KEumrbsM0fHNhBA3mzqiYRIaYSixTTRdbb6yUWz33h4CV4RNJ2goaJYjFfWgP5uDYA+HRIr2Wx/t3s9N8cvqopcfzMuywC4X4jfSuQ08S5qKsAoi+YAeHcLvJ/xH69I77S2Z6thy+a6X4vAaYlj67miFQ/M22LOUNS6oYX+UX1sVUi8DrSBc2IJ+7LwGAuLyDd76XLmsWHweF02E8cDSxxtPwQHmjE66gaTCViewe0ErugnkQKwvz2bIkY9QiLzC+y8HiI8pB3FjbJiWdsA01U4oiK4wdcPwk+CXkaEJ63imqbetnZN4jgP4h/ZsZajo0foSe3pAgy5Iy/MSDWa4Xov2lHwndAjOXM6hj1q2npGl7kjwfpjKh2U2v+ggEkhcQ12IkQo4V3mK1c+Gft0jxF6PsDK0IvDwU1NYtQYyOOppgcpYbgcpozaAkh4UFagVPA88TjbdWWmoIjcu/DpAKY5BUFG57Z21qUO78DkmEaNX55xpg+YsCT5BD02WJ+0GRWscisg48pZ6GYB6lwAuNpv5LUNOFO+2N1PGCw/mo8TGEYUoQkx/qkrnkOvjmfi1i4lpIwhjKDUZ1UzCDB8E9M8OiBq4u4VjWjdwLM5fvxEQKIpOFOv7SE5TZ4CSUQ8jVyPIlN1Upfx353CfoSev2aqg5G4bPVzoHpIZ8D52mNXuQw3zuvWfo6m9aSH1qF1NeVf9zG9qjyavuJHieNGP6qzThzgeOLm+n1YkWhNBrKBrJ3aqZ7ksH2IZ6BB/vYfUoSMKN6oXUnUa9ldfXflTtoSGnpEBSVqkWwySg0GI+AibimzSRt+g1idcqCRK2O0hkEsE8Wo1mq1zbhNLtfii0jwnZkmiOxitpqnaP7vMgWmzFQ49KCJ0MvtnOF27+zAEsETpEe4dKy7oLqApw+QWVD80p36ddvF1DcJhHZqo/mv2ya6PPovWnW8alz/MUgOSQMCyGj0csAZc6CLi2zwbBlSkYv3jfZGf4zw9jKb8jZTlMjKpGeVcaSsOUc+A4a2B6Qyny58tqu7g4UCD55dXbfxKP+8Kbyty0HTXzF8mTTdqQmmj7mos+rgOqIYNepf0AkXTnQdfNy62uOhI1Tv+i0Bg7mOis4XAVIsOXKi+C/S55e7XVOer1PsexdYLEUlOb+r/8594SO93/J254w4yvsnbHLrT1y3+smiHadiL6ME9YjhWGdLTQtW4E29TycUwGV10afI3hmMbsDmt8IO2zs3wD4az4hfNqiIdNLtzgdamx8Urvah2UWM3wECkPc6s7xfH9TB8K54HBUquicAAES/lfXdhlffCmV2xBnNbc3AlWjIcjWRtB6pfKCoPRv4IueVCaoRK1S8Msd3AkoawQ1pNDi/PE5wOu5yqiQzlXdf/Dd4lKWt+XcI566Ns2YOQI4YmtRine8IOR9pVNh34f7EnZJwOwk5SYxRCLn23M2Lp3zE8Dk5GyeXAW66+ddjFBkKUUFZLtWUz4iWa4wxBzjHK9IdgSwJ6rr5ygVrpINHYT0VNf2D1zGN9qGJXj+HLZUg5PV2UigQepAx3CNwsxoWUpPdlXKmbITE8SCZQut7PtV5XRAzNaTZ0Lh1h/3rbikW7TWYaXBS+3bwdZD4MKkPPkgw0JCP5Owbsba1ZBilvDXNWFB5Qk3oNjFFudZnlypIP6v3FpcKh3eUQ7aCj65YHHpdd5gg844D56seH6F9lRbxv+d0PXyc/GkUWxhB/woqxYAVDA/r/p71TpsuLNHUBu3ID5pF0eX07l/t8a1Qpin1Y+SEY/FM9ylhnEBL+YWjd1SGLUgAcMzKIQTdQKIQj+yieqx/KJ/zIP+kxRUjJkrvQJr7IFpADnx+Cg4vN6O6fkv+Xy2+srG5/SBb0vxNlbXDVn2/XgIhEh/QNvaHFeoALeopOljiztAdPl5ks1zKzHKx2Q054u5pyhUtzbVcCLUVF6oyxLgMIJGGHtzjeXYzbX5jlAnzLKviaAlpz9zglLyZRrqUkNbWwuphz9l1P0axH6WLUvwrBYjZddo+SDhqYtfokatQV1lyQquZNQYYail10xadLTblvIuEPNK88HxHxeolbScV8Fao0fmVRUPuzFg9ihxmJFOGYyaycIjmAw9+mvqnICJZrLbMl9KeBKD+B+BQA7uM1TV3tQ9JuWepaWRh6b9ppp3+Zjo4nIvcbHGgTJoEoMAnuscZb+Fwa1oARJ4PMQc3aBOEAhuooyKMWbKYqpN/3hFy5UHigqPoPAfFfKWNcqlXAEBO3EI1dj/GGW9rHQt9vgwsCEx6j1wH2Jg3hHSSVvwRWFI5626c2PIrFveqFt1BaVX+wTPToNtWnuzwZ7eocdRDFzyilLMETUl4bcu+fv/42mazLOmotc7yCm3B5QFSqF5gIS+ojEjndMs38yKxU4MRmNyb5G7FIoUYTz17uZVpEXRJvWLGETkUnsDpkKuaGLGa4FdwI0F7wUasbNknT0pc0Q++5cSpgc/MoDxDQW2b9pvBJGPnpdSCDWuDylRKzCICtCt28YIn1OxUxJ+6+vzk1bviV1ixE6/pZc/Z05PNgTieUQRLakloPgksYTU4iNDQ+ToflBkzndb5Smx8nodayU+uV/Xop6Vq+TZQ/vTFqmfnNuSnKbppoxlCVH7/HIFhsNBcAaDj3Wvbc2/yrsAZ/+80EnjSz0zsVbDa4/wp4fw4lIBvC1rNthepP6HMZiV1bpIwWOUiYiTLEhcw0XeshiQhb1on5QDsaxlWJWEtvDZ8/c3LbtiFaHUE3Tjp38M6CJjTF7xgtgrlM+4Gq6DOD56XugR3P81Pfl5Pl23Ut2BXwfW/klnL7ahABsmDVmWF2qZESzt2kS9idPxSyqEWcEdu9CY2oulzKB2EwCN0OeedsSlrCFHbxG7AR6yI1OtmZcW+jWhvWdnNPKf6MSW7QkQUtFfG7BHsRo6RzZGPBX0YJkUUMv+QDTrdG7afRz25ohgb4Ssl2bG87pJ0z3qngPcPBEOrh2RPt8+84ozDi11xfPnSdAdCpbRxBR2jIS3xAV7+tibS5vpwS9z868+Dhk1n74mbpkYY4g833rw1AcSoyVH75ssiInjlKYSvm3IYj9dY4ic/B1picaawjP6ZuzMcuZydbSqTncxBr40dubsiL0EO/GXlREOZb/QSHtNcv+CAnjdwvKNCMZ/D+bombCes6OMiZupbXxbyGTybQ8G+hA8CW6LOP+wBjlvgllZO094Ct1buKbBOW6lwIE8wSB4ktkrJH9LuWlg4rUi+6PMHv+kgtqHjTBfiKC5n4kF0pOQwiSw23k46rBjpAmunVS1NRw4/x5MA8s+NDC7dxqbjjvtxznqQQ9ZSbBUWdUijXqc8otOvF2PfWtAj0XqGiOBYrAJi6drSa3TWlNg/H9PsI1mxWnBe/kGGS105RhaLil3ZlbBVlErBst9WzgER2ruf8teXaWaU6aKydXNjiaFZ77n56diSSxt7SFoRZtGEa1SUD0AdWCQO2HF/q/N3waCrjDWXR0yvnAc8uLsfpn0twleAA7VNJfNZj8XmTcIEcv5fPvGzq5a12z5cXl41rP/vT5Hi7Mq2h5SeXd6BTVjQ5yAmtKdwsaXTXNPXLFLqjBnoGTCyBXykpVZd0Z5Nibz/XcRFi5pUlrePZ3mXKaKroD8LsQL42u6i4+ULrgLxrbSviR2pRz+0rGKsciq0aj3JAarbkijZ8gVWVBgXGjFwI3AxKMiJqCu/uk9GVVzQYIGo6evXiEdbweIMCnn/n7toUu46jOvaqinId/RyLtRRvR8tSzFEPVU/GzpdENs4l/OAI9kqaYIbU/+Bln7l68MKXyDWU9WssBKGhjrH4N6Vi+fPu2dTjPLNbSJdnWgw1FnuK1SwTtc7T5Z7FCXB6mg7HQwMiJ/fqx3B3Ix11im1eukUjgQC5DHC2l0eAUvfNQ7OivgTLDEPzwe+M2ayczAigbwwCEEkGHdQgLpNW7uAXqjBzkINHQwjA4q1VF4oCWrRy+49RHbud/RMj9qobzJ0yuuHYhWzbaSkca7mxMUZRS7hWyE2RAFFirunGC+zGkshR5DDG2tqb6KYZPrnD8t3jRZiUUhImaD1Y/dGoMXz7RoMXZmz4ucpGC6ZOB1ZFrDyaBDRj1W6Jh+ITdsfBhcC/+c7hdUV/iOcJDPEhQ48zV+QwR45cs/8HcHUCLBN0sHAxo7Wpf7EF69GLo0JDCgHfys+b+7ohaxCxoRfKwij62acmg+HAlWD258bmgSlbzWcHtiXqFZludCClLGxVSXdi48M0Q17E7E39SXHGkD6UN2mYKkuWugXTV797vjffBwKaIM9Zp/8ym1JVWE+3bUVvn6ucBZWGMf/FMSdPcVTdnVB1FrPp/IqCiUcZ3z/WO2fUiYLjHgBNiyZNjWmIBu3ciS7nICheeCYbhb59c0nBgsTphC3gC49gBgjXt46iYGZBeg8j9DzBU/Nqe8GU2jUKjHI76JZMrENak5uXUsmwpBXF3lDjsxg5bgy6SvRj3Z1yigrlxRkZn8wAD7FGCmr5k0K6JMVx/SCnafOTn+fDth01cQVq6U8aO+0eXepse1bMJA//DNEehzhpEpUbEaeGXQ5asdF80NF9cv5OJUZPQaphXTSUMrd7tzX0Euhz9gnNoXwRuNXqoqaDiUbEWHoClPjISDq6dH0QexTiq7xEeqD33fsozdLF5wdZzLIX06iryoyQBR7dCd28ZnI3CKLeocUwF+WJfiVGkQv0rV4r8wuaSrQqTB2paxbRQM0FQi6FWFs6U8XUb40L40+sgeCCF8+378Sxwaiht6/4y8u+syw9a7BQIr15FWVwCSiKQQKlhddlANrZ0VkG6CAHzmPXcS6F+e0TeGj7IW61lKD6XyAcJ9ceeRswLfj4r3WvfdIIZGGjmUGeiHP6k2AUNV+bqUzw1bMgsay7dPfXyCH23H4P1UBBK304H1B7UVDYIB5IMOAADf7NwsrP6vv0CCoh4Wa3dmQw8arVFZj8nvgvmaHScD8aLV5zsbctSv4xG/dUOD6R+Pts7xsy4BMZLp97HTnE9iTG7t5IMyG6i2dSVhvaNbR5atRVte5p1nuM/5T99FX3gFtg6ffM7LVqdfwfxaDDZozcx3nMNEEVbG4+S5XiO4/mnT+9gBd4T64YyOmBJLpJ74ApxipbMVYeb2mW3+7V4JK1iC0opHk/JSsuslLI24ZNJAKoEaF43gwQ8EebTKnpOlGz1g82c4ftq+QQmNquPgAJKJZtHJfbunxgj1KWSqo/6anI+zEl2YQpGI2Rrd2b/0RlyBuLtVsor207WRPokbDGB+u17jSHrmnl6siS7CkofktkxzkhuZrSGtXJYp1Vd3LgLxBtlUnGMryHMwgI/vkia7k36KXUgO1QLV6DLXrPMQlKdWvRwq7WeWj8FQWzW4XVg9YUMPfzGbNW/mugvVUsFizVYp1X5Rdyz2MPapOPCABC1dZnvTNU/ukswDyj3hwLXFcQRZxCMAc1qUGpyK8qiKh/4j+8IXTDbsmcUMrtZAztCQ6kvaWPlnaFRbsfLk4O48kUc7Ghd5muOxyoc8I98Df3J9byBrWYMyc6goWpFLKOKXTb+/9wkJOJsdntFaHdIW1SAM4XTzKbXwAh/kJZJ8XrA9CRTS+heWYlwINA9xQP9heHN/CFOUz5KUZnzIXgT38edfEd3VnlFALsb84KB5GKYvorTUZ8aPwsbTRTOZU0y1R1racGpWU7uK/snC6NPOoPG7HJ0kMwFEcW3/trxQ+kHzEwfgLZt3lhk5/dEX7tpVjxaoy8micIGD0b7kMXHdMUdiJz78Fejlm4d+OyZkl2uQK4t5M+3muX8MM0xpQ+XgS46VJrc3kZJJXn06mMjmMx0A7k9HiymixdEb0sHpwt5E3p7NP+Ock310bm6RMccl9I2U+wc090SSc1TJwaWlOC7Q/RnwV7oyx4mut6i+9yueEH7vBktvURfQuT4jT83xH2p/nKVfxGXzaplJaK3niZBK/n7qdSUiicY7mtvqqlhfys+jUEB+I42pY4ioGm0Q09eJPaW2+4/9dQBN6gejJz9HwSCL0H/pt1O5LZ07Hgxujl144EXY4wFdhIZ+u0o6ig30cfjC7FC2c4dAu0D/JaXXW/NvlZVALh+PMEjVLeJHhYkr4j5AnLyhPc4C0Ob/6rfn5xEJ88r/wlYhyx+k0xcw/Nm4s9L45qoOHSQA/HsPJpN8wnS/h9SVvI9985Dw51qpqwp+LsZyBJMr4h2b5fYUJ3CVOkbkvgAzCMLG1+1GDnvrmrElT4BeN3Haqf/xef8h8mS/Nq7cROxIrlCJhdXV1fv0ymj7wXTIvjXkPT2Ur7G0NMf1ZlA4nhtbFggDp3TYvfbzBLgWoi4VizplYV14nV79ic8380BIErvCgjGkWB+LBZdBaEDXF0hTJjypfSeqQ3DAj9FYB0vPI1nvsOHskah64Hhqw3OS0xTw5af4UTCqc2moSCJY+Lsxe5a7i8d8ANlRwhaBF/HXxIsQxsxII8JmRh0KZ3ApCnmHueytcG+56ePzR4Yf2libGeLLIiwTOIxjrKB+YnJhZVeBXjkvvsUTsM5b4DuYxyLJ/0iTn8vJeTFjEjrFFG0DZx9t2LSWFcRkbzR+SMfoPmGk8y9IRn+6GmfWWhgID7xcwxjEcfBeyCjT4Hc285skWMqRhwPInpnyXBhkVTfj6Jmx806gJBXkKsqbQk3ynL/MNE6KPBrh6mdWGAfBLY1ieMM/Zw5xMLOHsV2QOOM+/ZxHet4ZJGje6evSP5G9qfSqk/pFyTvoB8Yor2lxJ58McXCCUSuBot11sHkokVM6erQj5hmUyTwyuY9AB8ssWTnUxJIgRsmJQjIrS+SyrFjoHdYLUbDlCrS2hz645H44/RBTNPNWsdF+nCUQAQH0Ubwz7EFhRzQ/h1UrH0cOIRB87bNBJkN+l5aPD19cdofQpAbEG103Mi0OyREYT03SZxXBoD9i2kB/pqJ/3iCpOBajB6klGDawVvQtC0tDZpBVwHAQgFOHkOrCnsZBDbXbg2KRAU9IOIXIOhDTheBVswuoQpE/L2WFnmYDFPbjD0W14Vz4bT8UzTY+wytJo/542+EPeNFbTM8hTSko/Z+U0084jxEPEoG4UKYm4yVm7AkmYxyaEthNQk693eD9y34l0bMW6jkWP6w9dbjIy6UysNChrVEG1oj7CCKQNNMbALY5+fdEx94zjVgXdT3vyA43/v6nA3fR98AuByLHHZxWcqYnuDjulXiJ3hkQJh2klvRyLbDn4Q42agnM1LRGegzZMJ/CVbddKW2huKXgJ4adeau7uhLJnbsBtFwgCv/ilAK6TDd/0J4ElIHHKitc4PUMMNL6+jy08HyQFS62QrqiS1wLdY3hxRAN9faFvTVAQkJjGCWmBKusrnUeFDRArp6ve/NSyn3/IuvOQK3NLw129t9MXKs2MHbX/1eZNob0DQSi49+usCxAVsmgpwYfbcio45F1yijDtdkqBioD+DjEAYVsKjZRjNKG0s7J91Ik1Ke3xNxfBqlsAwSKLkIqayscNGZfV/tbbF/7UQJKMoLhEtWNbu2PirRilgBennSY+Qqc+ScnEn7eQeokxXUWUGqX3O+7oT33nLpBtKGapgTArK/43awWjbIXgisufy6y1A3G06sgVNTirzgAAAA='
    },
    { 
      title: 'Team Building Activity', 
      category: 'Team Work', 
      image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Match Preparation', 
      category: 'Matches', 
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Coaching Session', 
      category: 'Coaching', 
      image: 'https://th.bing.com/th/id/OIP.WrC96hxtyKCvx2_3p4A2nQHaEd?w=317&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    },
    { 
      title: 'Fitness Training', 
      category: 'Fitness', 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Awards Ceremony', 
      category: 'Achievements', 
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Junior Programs', 
      category: 'Youth', 
      image: 'https://th.bing.com/th/id/OIP.DRFQzqzpK6lg8AFQ8XNmGwHaNK?w=115&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    },
    { 
      title: 'Advanced Training', 
      category: 'Elite', 
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <>
      {useDynamicTestimonials ? (
        <Testimonials />
      ) : (
        <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 text-8xl animate-rotate-slow">🏏</div>
            <div className="absolute bottom-20 right-20 text-6xl animate-float">⭐</div>
            <div className="absolute top-1/2 right-1/4 text-4xl animate-pulse-slow">🏆</div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Enhanced Testimonials Section */}
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6 animate-slideDown">
                What Our Players Say
              </h2>
              <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full animate-shimmer"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideUp mb-4">
                Hear from our successful players and their families about their incredible journey with us
              </p>
            </div>

        {/* Testimonial Navigation Controls */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-10 h-10 rounded-full bg-cricket-green/10 hover:bg-cricket-green/20 flex items-center justify-center transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <span className="text-cricket-green text-xl">←</span>
          </button>
          
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-cricket-orange w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="w-10 h-10 rounded-full bg-cricket-green/10 hover:bg-cricket-green/20 flex items-center justify-center transition-all duration-300"
            aria-label="Next testimonial"
          >
            <span className="text-cricket-green text-xl">→</span>
          </button>
        </div>
        
        {/* Auto-sliding Testimonials */}
        <div 
          className="overflow-hidden mb-20 pb-4 relative"
        >
          <div
            ref={testimonialRef}
            className="flex"
            style={{
              transition: 'transform 0.5s ease',
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="w-full flex-shrink-0 px-4"
            >
              <Card 
                className="card-hover gradient-card border-0 shadow-xl overflow-hidden relative group h-full"
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cricket-orange/10 to-cricket-gold/10 rounded-full -translate-y-4 translate-x-4 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cricket-green/10 to-cricket-orange/10 rounded-full translate-y-4 -translate-x-4 animate-float"></div>
                
                <CardContent className="p-6 relative z-10">
                  {/* Testimonial Image with Fallback */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-cricket-orange/20 shadow-lg">
                    {testimonial.image ? (
                      <img 
                        src={testimonial.image} 
                        alt={`${testimonial.name}'s testimonial`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to letter avatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.className = `w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20 flex items-center justify-center bg-gradient-to-br ${testimonial.color} text-white text-3xl font-bold shadow-lg`;
                            parent.innerHTML = testimonial.name.charAt(0);
                          }
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${testimonial.color} text-white text-3xl font-bold`}>
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Star Rating */}
                  <div className="flex items-center justify-center mb-4 space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-yellow-400 text-xl animate-zoomIn hover:animate-wiggle cursor-pointer`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  
                  {/* Enhanced Quote */}
                  <div className="relative mb-6">
                    <div className="text-6xl text-cricket-orange/20 absolute -top-4 -left-2">"</div>
                    <p className="text-gray-700 italic leading-relaxed text-center relative z-10 animate-fadeInUp max-h-32 overflow-y-auto">
                      {testimonial.content}
                    </p>
                    <div className="text-6xl text-cricket-orange/20 absolute -bottom-8 -right-2 rotate-180">"</div>
                  </div>
                  
                  {/* Enhanced Author Info */}
                  <div className="flex flex-col items-center justify-center animate-slideUp">
                    <h4 className="font-semibold text-cricket-green hover:text-cricket-orange transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-cricket-orange font-medium">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          </div>
        </div>

        {/* Enhanced Gallery Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6 animate-slideDown">
            Academy Gallery
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full animate-shimmer"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideUp">
            Take a look at life at Kalyan Cricket Academy - from training sessions to celebrations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <Card 
              key={index} 
              className={`card-hover border-0 shadow-xl overflow-hidden cursor-pointer group gradient-border animate-bounceIn stagger-${index + 1}`}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-square bg-cover bg-center relative overflow-hidden image-overlay">
                  <img 
                    src={image.image} 
                    alt={image.title}
                    className="w-full h-full object-cover image-zoom hover-brightness"
                  />
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-semibold text-lg mb-1 animate-slideUp">{image.title}</h4>
                    <p className="text-sm opacity-90 animate-slideUp" style={{ animationDelay: '0.1s' }}>{image.category}</p>
                  </div>
                  
                  {/* Decorative Corner Element */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-cricket-orange/80 rounded-full flex items-center justify-center animate-bounceIn">
                      <span className="text-white text-xs">🔍</span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-cricket-green/90 text-white px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-slideDown">
                    {image.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fadeInUp">
          <div className="bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 animate-slideDown">Join Our Success Stories!</h3>
              <p className="text-xl mb-6 animate-slideUp">Be part of our growing family of successful cricketers and create your own success story.</p>
              <button className="bg-white text-cricket-green px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 ripple-effect animate-bounceIn">
                🌟 Start Your Journey
              </button>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute top-4 right-4 animate-float">
              <div className="text-4xl opacity-30">🏏</div>
            </div>
            <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-3xl opacity-30">⭐</div>
            </div>
            <div className="absolute top-1/2 left-8 animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-2xl opacity-20">🏆</div>
            </div>
          </div>
        </div>
      </div>
        </section>
      )}
    </>
  );
};

export default TestimonialsSection;
