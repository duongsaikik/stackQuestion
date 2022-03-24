import { Box, Typography, makeStyles } from '@material-ui/core';
import mern from '../Assets/Images/mern-stack.png';
import mernn from '../Assets/Images/mern.png';
const useStyles = makeStyles({
    component: {
        margin: 50,
        '& > *': {
            marginTop: 50
        }
    },
    image: {
        width: '50%',
        height: '50%'
    }
})

const CodeForInterview = () => {
    const classes = useStyles();
    return (
        <Box className={classes.component}>
            <Typography variant="h4">MERN Stack (MongoDB , ReactJs , Express , Node.js)</Typography>
            <br/>
            <Typography variant="p">Chắc mọi người cũng đã từng nghe qua MEAN stack. MERN stack là nguyên bộ combo open source các công nghệ đều liên quan đến Javascript là cũng hot nhất hiện nay: MongoDB, ExpressJS, React/React Native, NodeJS. Người ta dùng MERN stack để xây dựng React Universal App. Trong đó:</Typography>
            <br/>
            <br/>
            <Typography variant="p">  1.MongoDB Là một noSQL database hot nhất hiện nay. MongoDB thường đi với Mongoose – một library để giao tiếp với MongoDB dễ dàng hơn.</Typography>
            <br/>
            <br/>
            <Typography variant="p">  2.Node.js là một Javascript runtime. Để hiểu được định nghĩa của nó thôi cũng không phải chuyện dễ. Mình có viết một chuỗi bài viết về Node.js, bạn có thể xem thêm nhé</Typography>
            <br/>
            <br/>
            <Typography variant="p">   3.Express Express là web framework được xây dựng bằng Javascript chạy trên nền Node.js. Nó hỗ trợ thêm nhiều tính năng cần có của một web framewok như: routing, middlewares, template engines</Typography>
            <br/>
            <br/>
            <Typography variant="p">   4.React/React Native React là thư viện frontend được viết bằng Javascript, nó là hàng của Facebook đang rất hot hiện nay.</Typography>
            <br/>
            <br/>
            <Typography variant="p">   React Native kế thừa từ React và nó là framework để viết ứng dụng di động da nền tảng</Typography>
            <br/>
            <Typography variant="p">  Easily build production ready universal apps</Typography>
            <Box style={{ width:"auto", height:"auto" ,objectFit:"cover" }}>
                <img src={mern} className={classes.image}  />   
                <img src={mernn} className={classes.image}/>             
            </Box>
           
        </Box>
    )
}

export default CodeForInterview;