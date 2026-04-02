const { useState, useEffect, useRef } = React;

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-03-01", amount: 5000, category: "Salary", type: "income" },
    { id: 2, date: "2026-03-02", amount: 800, category: "Food", type: "expense" },
    { id: 3, date: "2026-03-03", amount: 1200, category: "Shopping", type: "expense" },
    { id: 4, date: "2026-03-04", amount: 600, category: "Transport", type: "expense" }
  ]);

  const [search, setSearch] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const income = transactions.filter(t => t.type === "income").reduce((a,b)=>a+b.amount,0);
  const expense = transactions.filter(t => t.type === "expense").reduce((a,b)=>a+b.amount,0);
  const balance = income - expense;

  const filtered = transactions.filter(t =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const highest = transactions
    .filter(t => t.type === "expense")
    .sort((a,b)=>b.amount-a.amount)[0];

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const dataMap = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const labels = Object.keys(dataMap);
    const values = Object.values(dataMap);

    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ['#6366f1','#10b981','#f43f5e','#f59e0b','#06b6d4'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#9ca3af' }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw(chart) {
          const { width, height, ctx } = chart;
          ctx.save();
          ctx.font = "bold 18px sans-serif";
          ctx.fillStyle = "#e5e7eb";
          ctx.textAlign = "center";
          const total = values.reduce((a,b)=>a+b,0);
          ctx.fillText("₹" + total, width/2, height/2);
          ctx.restore();
        }
      }]
    });

  }, [transactions]);

  return (
    React.createElement("div", { className: "app" },

      React.createElement("div", { className: "sidebar" },
        React.createElement("h2", null, "🚀 FinDash"),
        ["Dashboard","Transactions","Insights"].map(item =>
          React.createElement("div", { className: "menu-item" }, item)
        )
      ),

      React.createElement("div", { className: "main" },

        React.createElement("div", { className: "topbar" },
          React.createElement("h1", null, "Dashboard")
        ),

        React.createElement("div", { className: "cards" },
          React.createElement("div", { className: "card balance" }, "Balance ₹" + balance),
          React.createElement("div", { className: "card income" }, "Income ₹" + income),
          React.createElement("div", { className: "card expense" }, "Expense ₹" + expense)
        ),

        React.createElement("div", { className: "grid" },

          React.createElement("div", null,

            React.createElement("div", { className: "controls" },
              React.createElement("input", {
                placeholder: "Search...",
                onChange: e => setSearch(e.target.value)
              })
            ),

            React.createElement("canvas", { ref: chartRef }),

            React.createElement("table", null,
              React.createElement("thead", null,
                React.createElement("tr", null,
                  ["Date","Amount","Category","Type"].map(h =>
                    React.createElement("th", null, h)
                  )
                )
              ),
              React.createElement("tbody", null,
                filtered.map(t =>
                  React.createElement("tr", { key: t.id },
                    React.createElement("td", null, t.date),
                    React.createElement("td", null, "₹" + t.amount),
                    React.createElement("td", null, t.category),
                    React.createElement("td", null, t.type)
                  )
                )
              )
            )
          ),

          React.createElement("div", { className: "insights" },

            React.createElement("div", { className: "insight-card" },
              React.createElement("p", null, "💸 Highest Expense"),
              highest && React.createElement("h2", null, highest.category),
              highest && React.createElement("span", null, "₹" + highest.amount)
            ),

            React.createElement("div", { className: "insight-card" },
              React.createElement("p", null, "📊 Total Transactions"),
              React.createElement("h2", null, transactions.length)
            ),

            React.createElement("div", { className: "insight-card" },
              React.createElement("p", null, "💰 Balance Status"),
              React.createElement("h2", null, balance > 0 ? "Healthy" : "Low"),
              React.createElement("span", null, balance > 0 ? "Saving good" : "Control spending")
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));