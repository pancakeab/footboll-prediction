import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PredictionApp() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [possessionHome, setPossessionHome] = useState("");
  const [possessionAway, setPossessionAway] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        home_team: homeTeam,
        away_team: awayTeam,
        home_possession: Number(possessionHome),
        away_possession: Number(possessionAway),
      }),
    });
    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-96 p-4 shadow-lg">
        <CardContent className="space-y-4">
          <Input placeholder="Echipa gazdă" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} />
          <Input placeholder="Echipa oaspete" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} />
          <Input placeholder="Posesie gazdă (%)" value={possessionHome} onChange={(e) => setPossessionHome(e.target.value)} type="number" />
          <Input placeholder="Posesie oaspeți (%)" value={possessionAway} onChange={(e) => setPossessionAway(e.target.value)} type="number" />
          <Button onClick={handlePredict}>Prezice rezultatul</Button>
          {prediction && <p className="text-lg font-bold">Predicție: {prediction}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
