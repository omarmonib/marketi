import CouponForm from '@/components/admin/coupon-form'

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Coupon</h1>
        <p className="text-muted-foreground mt-1">Create a new discount code</p>
      </div>
      <CouponForm />
    </div>
  )
}
