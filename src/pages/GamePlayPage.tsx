import  { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, CardMedia, Stack, Table, TableHead, TableRow, TableCell, TableBody, Chip, } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import {
  fetchWinnersStart,
  drawWinnerStart,
  nextPrizeStart,
  gameStart,
} from "../features/game/gameSlice";
import Lottie from "lottie-react";
import animationData from "../assets/Spin Wheel 2.json";
import bgVideo from "../assets/istockphoto-1185999245-640_adpp_is.mp4";
import celebrationBegin from "../assets/CelebrationsBegin.json";
import celebration from "../assets/celebration.json";

const StartGamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {  game,drawWinner ,winners } = useSelector((s: RootState) => s.games);

  const [showDrawWinner, setShowDrawWinner] = useState(false); 
  const [showAnimation, setShowAnimation] = useState(false); 
  console.log(winners);

  useEffect(() => {
    if (id) dispatch(gameStart(id));
    dispatch(fetchWinnersStart(Number(id)));
  }, [dispatch, id]);

  if (!game) return <Typography>O‘yin ma’lumotlari yuklanmoqda...</Typography>;
  // useEffect(() => {
  //   if (drawWinner) setShowDrawWinner(true);
  // }, [drawWinner]);

  const handleDrawWinner = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      dispatch(drawWinnerStart(Number(id)));
      setShowDrawWinner(true)
      setTimeout(() => {
        setShowDrawWinner(false)
        console.log(drawWinner);        
      }, 5000);
    }, 13000);
    
  };

  const handleNextPrize = () => dispatch(nextPrizeStart(Number(id)));

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* 🎬 FON VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          // filter: "brightness(0.45) blur(2px)",
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {showAnimation  && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,

          }}
        >
          <Lottie animationData={animationData} loop={false} autoplay style={{ width: 1100, height: 1100 }} />
        </Box>
      )}
{showDrawWinner && drawWinner && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 120,
            // width: { xs: "92%", sm: 520 },
            color: "white",
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ width: 140, height: 140 }}>
            <Lottie animationData={celebrationBegin} loop={false} autoplay />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ color: "gold" }}>
              🎉 Tabriklaymiz — {drawWinner.winner.full_name ?? "Anonim"}!
            </Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>
              Siz yutdingiz: <b>{drawWinner.current_prize.name  ?? "sovrin"}</b>
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              Telefon: {drawWinner.winner.phone_number ?? "—"}
            </Typography>

            {/* prize image if exists */}
            {drawWinner.current_prize.image ? (
              <Box sx={{ mt: 1 }}>
                <CardMedia
                  component="img"
                  image={drawWinner.current_prize?.image}
                  alt={drawWinner.current_prize.name}
                  sx={{ maxWidth: 180, borderRadius: 1 }}
                />
              </Box>
            ) : null}
          </Box>
        </Box>
      )}
      {/* 📋 Asosiy kontent (animatsiya tugagandan keyin ko‘rinadi) */}
      {!showAnimation && (
        <Box sx={{ position: "relative", zIndex: 2, p: 4 }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,

            }}
          >
            <Lottie animationData={celebrationBegin} loop={false} autoplay style={{ width: 800, height: 800 }} />
          </Box>
          <Box sx={{
            position: 'absolute',
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}>
            <Lottie animationData={celebration} loop={false} autoplay style={{ width: 1000, height: 700 }} />
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold", textShadow: "0 0 10px #fff" }}>
              🎮 O‘yin boshlandi: <b>{game.name}</b>
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": { boxShadow: "0 0 15px cyan", borderColor: "cyan" },
              }}
            >
              🔙 Orqaga
            </Button>
          </Stack>
          <Box sx={{
            display: 'flex',
            flex: 'wrap',
            gap: 10
          }}>

            <Card
              sx={{
                display: 'inline-block',
                mb: 3,
                p: 2,
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1">
                  🏪 <b>Do‘kon:</b> {game.store?.name}
                </Typography>
                <Typography variant="subtitle1">
                  💎 Bonus oralig‘i: {game.from_bonus} - {game.to_bonus}
                </Typography>
                <Typography variant="subtitle1">
                  📊 Status:{" "}
                  <Chip
                    label={game.status}
                    color={
                      game.status === "active"
                        ? "success"
                        : game.status === "finished"
                          ? "error"
                          : "default"
                    }
                  />
                </Typography>
              </CardContent>
            </Card>
            <Stack direction="row" gap={2} flexWrap="wrap" mb={3}>
              {game.prizes?.map((p: any) => (
                <Card
                  key={p.id}
                  sx={{
                    width: 200,
                    bgcolor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 2,
                    transition: "0.4s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  {p.image ? (
                    <CardMedia component="img" height="140" image={p.image} alt={p.name} />
                  ) : (
                    <Box
                      height={140}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(255,255,255,0.1)"
                    >
                      <Typography color="white">Rasm yo‘q</Typography>
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="subtitle1">{p.name}</Typography>
                    <Typography variant="body2" color="white">
                      Miqdor: {p.quantity}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Turi: {p.type}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} mb={3}>
            <Button
              variant="contained"
              color="success"
              onClick={handleDrawWinner}
              disabled={game.status !== "active"}
              sx={{
                textShadow: "0 0 10px #00ff99",
                boxShadow: "0 0 10px #00ff99",
                transition: "0.4s",
                "&:hover": { boxShadow: "0 0 25px #00ff99" },
              }}
            >
              🏆 G‘olibni aniqlash
            </Button>

            <Button
              variant="outlined"
              color="info"
              onClick={handleNextPrize}
              sx={{
                zIndex: 20,
                borderColor: "#00bfff",
                color: "#00bfff",
                transition: "0.4s",
                "&:hover": {
                  borderColor: "#00ffff",
                  boxShadow: "0 0 25px #00ffff",
                },
              }}
            >
              ⏭️ Keyingi sovrin
            </Button>
          </Stack>

          <Typography variant="h6" mb={1}>
            🏅 G‘oliblar ro‘yxati
          </Typography>

          {winners.length === 0 ? (
            <Typography color="white">Hozircha g‘oliblar yo‘q</Typography>
          ) : (
            <Table sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", borderRadius: 3 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>№</TableCell>
                  <TableCell sx={{ color: "white" }}>Ism</TableCell>
                  <TableCell sx={{ color: "white" }}>Telefon</TableCell>
                  <TableCell sx={{ color: "white" }}>Sovrin</TableCell>
                  <TableCell sx={{ color: "white" }}>Vaqt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {winners.map((w: any, i: number) => (
                  <TableRow key={w.id}>
                    <TableCell sx={{ color: "white" }}>{i + 1}</TableCell>
                    <TableCell sx={{ color: "white" }}>{w.client.full_name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{w.client.phone_number}</TableCell>
                    <TableCell sx={{ color: "white" }}>{w.prize.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {new Date(w.awarded_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StartGamePage;
