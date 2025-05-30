import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading(){

    return(
   <Box sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', 
        zIndex: 9999,
}}>
      <CircularProgress aria-busy="true" />
    </Box>
    )
}