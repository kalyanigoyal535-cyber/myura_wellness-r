import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DeleteModal from "../components/DeleteModal";
import "../styles/Coupons.css";

interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_to: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default function Coupons(): React.JSX.Element {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    couponId: number | null;
    couponCode: string;
  }>({
    isOpen: false,
    couponId: null,
    couponCode: "",
  });
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<Coupon[] | { coupons: Coupon[] }>(
        "/coupons"
      );
      // Handle both response formats
      const data = response.data;
      if (Array.isArray(data)) {
        setCoupons(data);
      } else if (data && Array.isArray((data as any).coupons)) {
        setCoupons((data as any).coupons);
      } else if (data && Array.isArray((data as any).results)) {
        setCoupons((data as any).results);
      } else {
        console.warn("Unexpected coupons data format:", data);
        setCoupons([]);
      }
    } catch (err) {
      console.error("Failed to load coupons", err);
      alert("Failed to load coupons");
      setCoupons([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (coupon: Coupon): void => {
    setDeleteModal({
      isOpen: true,
      couponId: coupon.id,
      couponCode: coupon.code,
    });
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteModal.couponId) return;

    try {
      setDeleting(true);
      await api.delete(`/coupons/${deleteModal.couponId}`);
      setDeleteModal({ isOpen: false, couponId: null, couponCode: "" });
      await fetchCoupons();
    } catch (err) {
      alert("Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteModal({ isOpen: false, couponId: null, couponCode: "" });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (validTo: string): boolean => {
    return new Date(validTo) < new Date();
  };

  const isActive = (coupon: Coupon): boolean => {
    if (coupon.status !== "active") return false;
    if (isExpired(coupon.valid_to)) return false;
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit)
      return false;
    return true;
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description &&
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="coupons-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="coupons-container">
      <div className="coupons-header">
        <div className="coupons-title-section">
          <Tag className="coupons-icon" size={24} />
          <div>
            <h1 className="coupons-title">Coupons</h1>
            <p className="coupons-subtitle">
              Manage discount codes and promotional offers ({coupons.length}{" "}
              total)
            </p>
          </div>
        </div>
        <Link to="/coupons/new" className="coupons-add-btn">
          <Plus size={20} />
          Add Coupon
        </Link>
      </div>

      <div className="coupons-search">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search coupons by code, name, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCoupons.length === 0 ? (
        <div className="coupons-empty">
          <Tag size={48} className="empty-icon" />
          <h2>No coupons found</h2>
          <p>
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first coupon"}
          </p>
          {!searchTerm && (
            <Link to="/coupons/new" className="empty-action-btn">
              <Plus size={20} />
              Add Coupon
            </Link>
          )}
        </div>
      ) : (
        <div className="coupons-table-wrapper">
          <table className="coupons-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Valid Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>
                    <span className="coupon-code">{coupon.code}</span>
                  </td>
                  <td>
                    <div className="coupon-name-section">
                      <span className="coupon-name">{coupon.name}</span>
                      {coupon.description && (
                        <span className="coupon-description">
                          {coupon.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="discount-badge">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `₹${coupon.discount_value}`}
                      {coupon.max_discount &&
                        coupon.discount_type === "percentage" && (
                          <span className="max-discount">
                            (max ₹{coupon.max_discount})
                          </span>
                        )}
                    </span>
                  </td>
                  <td>
                    {coupon.min_order_amount > 0 ? (
                      <span>₹{coupon.min_order_amount}</span>
                    ) : (
                      <span className="text-muted">No minimum</span>
                    )}
                  </td>
                  <td>
                    {coupon.usage_limit ? (
                      <span>
                        {coupon.used_count} / {coupon.usage_limit}
                      </span>
                    ) : (
                      <span>{coupon.used_count} used</span>
                    )}
                  </td>
                  <td>
                    <div className="validity-period">
                      <span>{formatDate(coupon.valid_from)}</span>
                      <span className="text-muted">to</span>
                      <span
                        className={isExpired(coupon.valid_to) ? "expired" : ""}
                      >
                        {formatDate(coupon.valid_to)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        isActive(coupon) ? "active" : "inactive"
                      }`}
                    >
                      {isActive(coupon) ? (
                        <>
                          <CheckCircle2 size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link
                        to={`/coupons/${coupon.id}/edit`}
                        className="action-btn edit-btn"
                        title="Edit coupon"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(coupon)}
                        className="action-btn delete-btn"
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${deleteModal.couponCode}"? This action cannot be undone.`}
        itemName={deleteModal.couponCode}
        isLoading={deleting}
      />
    </div>
  );
}
