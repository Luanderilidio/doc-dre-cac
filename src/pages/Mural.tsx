import { useEffect, useState } from "react";


export default function Mural() {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setReloadKey(prev => prev + 1);
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="w-full min-h-screen border-red-500">
      <iframe className="w-full !min-h-screen border-red-500" src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FCuiaba&showTitle=0&showTz=0&hl=pt_BR&title=MURAL%20-%20DRE%20-%20C%C3%A1ceres&src=bHVhbmRlcmlsaWRpbzE3NEBnbWFpbC5jb20&color=%2333B679"  width="800" height="600" frameBorder="0" scrolling="no"></iframe>
    </div>
  );
}
