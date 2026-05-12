import React, {useEffect, useMemo, useState} from 'react';
import Sidebar from "../../layouts/Sidebar.jsx";
import LoyaltyStatus from './components/LoyaltyStatus';
import CouponTabs from './components/CouponTabs';
import CouponGrid from './components/CouponGrid';
import ReferFriendBanner from './components/ReferFriendBanner';
import ticket from './img/ticket.png'
import couponService from "../../services/couponService.js";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile.js";
import { getLoyaltyStatus } from "../../utils/loyalty.js";

const CouponsPage = () => {

    const [activeTab, setActiveTab] = useState('All');
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useCurrentUserProfile();
    const points = Math.max(user?.diem ?? user?.loyaltyPoints ?? 1, 1);
    const loyalty = getLoyaltyStatus(points);

    useEffect(() => {
        let active = true;

        const loadCoupons = async () => {
            try {
                setLoading(true);
                const data = await couponService.getCatalog();
                if (active) setCoupons(data);
            } catch (error) {
                console.error("Failed to load coupons:", error);
                if (active) setCoupons([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCoupons();

        return () => {
            active = false;
        };
    }, []);

    const userStatus = {
        loyaltyStatus: loyalty.currentTierName,
        currentPoint: loyalty.points,
        nextLevel: loyalty.nextTierName === "Max level" ? null : loyalty.nextTierName,
        nextLevelPoints: loyalty.nextTier?.points || loyalty.points,
        pointsToNextLevel: loyalty.pointsToNextTier,
        progressPercent: loyalty.progressPercent,
    };

    const getRequiredTierName = (requiredPoints) =>
        getLoyaltyStatus(requiredPoints).currentTierName;

    const couponItems = useMemo(() => {
        const now = new Date();

        return coupons.map((coupon) => {
            const requiredPoints = coupon.diem_thuong || 0;
            const expiresDate = coupon.hieu_luc_den || coupon.validUntil;
            const isExpired = expiresDate ? new Date(expiresDate) < now : false;
            const isOutOfStock = Number(coupon.con_lai ?? coupon.remainingUses ?? 1) <= 0;
            const isEnabled = Boolean(coupon.kich_hoat ?? coupon.active ?? true);
            const isInactive = !isEnabled || isOutOfStock;
            const isPointLocked = requiredPoints > points;
            const usable = !isExpired && !isInactive && !isPointLocked;
            const status = isExpired
                ? "EXPIRED"
                : requiredPoints === 0 && isEnabled
                    ? "ACTIVE"
                    : requiredPoints > 0
                        ? getRequiredTierName(requiredPoints)
                        : "INACTIVE";
            const tabStatus = isExpired ? "Expired" : usable ? "Active" : "Inactive";

            let disabledReason = "";
            if (isExpired) disabledReason = "This coupon has expired.";
            else if (isInactive) disabledReason = "This coupon is currently inactive.";
            else if (isPointLocked) disabledReason = `Requires ${requiredPoints.toLocaleString()} pts.`;

            return {
                id: coupon.id || coupon._id || coupon.ma,
                title: coupon.ten_khuyen_mai || coupon.title || coupon.ma,
                subtitle: coupon.mo_ta || coupon.subtitle || "",
                expires: expiresDate
                    ? new Date(expiresDate).toLocaleDateString("en-GB")
                    : "TBA",
                code: coupon.ma || coupon.code,
                status,
                tabStatus,
                usable,
                disabledReason,
                icon: ticket,
            };
        });
    }, [coupons, points]);

    const filteredCoupons =
        activeTab === "All"
            ? couponItems
            : couponItems.filter(c => c.tabStatus === activeTab);
  return (
      <div className="flex bg-[#F8F9FA]">
      {/*<div className="fixed inset-y-0 left-0 z-50">*/}
        <Sidebar />
      {/*</div>*/}
          <main className="flex-1 ml-64 p-8 pt-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <LoyaltyStatus user={userStatus}/>
          <CouponTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {loading ? (
              <div className="bg-white rounded-[32px] p-10 text-center text-gray-400 font-bold mb-6">
                  Loading coupons...
              </div>
          ) : (
              <CouponGrid coupons={filteredCoupons} />
          )}
          <ReferFriendBanner />
        </div>
      </main>
    </div>
  );
};

export default CouponsPage;
