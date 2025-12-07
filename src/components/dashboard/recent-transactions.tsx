"use client"

export default function RecentTransactions() {
  const transactions = [
    { name: "Kathryn Murphy", amount: "+300" },
    { name: "Karthik", amount: "+300" },
    { name: "Apparna", amount: "+300" },
  ]

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <button className="text-primary text-sm font-medium">See All</button>
      </div>
      <div className="space-y-3">
        {transactions.map((tx, i) => (
          <div key={i} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10" />
              <span className="font-medium text-sm">{tx.name}</span>
            </div>
            <span className="text-green-600 font-semibold">{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
