import connectDB from "../../../backend/db/connectDB";
import { validate } from "../../../backend/utils/validation";
import { navBarSchema } from "backend/utils/schemas";
import { NavBar } from "../../models";
import catchAsync from "backend/utils/catchAsync";

export const getHeader = catchAsync(async (req, res) => {
  // Connect to the database
  await connectDB();

  const header = await NavBar.findOne({});
  res.status(200).json({ status: "success", header });
});

// export async function createHeader(req, res) {
//   // Validate the request body
//   const { isValid, errors, value } = validate(navBarSchema, req.body);
//   if (!isValid) {
//     return res.status(400).json({
//       msg: "Validation error",
//       errors,
//     });
//   }

//   // const { name, email, password } = value;

//   // Connect to the database
//   await connectDB();

//   try {
//     console.log("BODY DATA :", value);
//     const navBar = new NavBar(value);

//     await navBar.save();
//     console.log("Navigation bar created");

//     res.status(200).json({
//       status: "success",
//       message: "Header data created successfully!",
//       navBar,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({ status: "fail", message: err.message });
//   }
// }

// Update Header data
export const updateHeader = catchAsync(async (req, res) => {
  // Validate the request body
  const { isValid, errors, value } = validate(navBarSchema, req.body);
  if (!isValid) {
    return res.status(400).json({
      msg: "Validation error",
      errors,
    });
  }

  // Connect to the database
  await connectDB();

  // console.log("BODY DATA :", value);
  const navBar = await NavBar.findById(value.id);
  if(!navBar){
    throw new Error("No data against the ID")
  }
  Object.assign(navBar, value);
  await navBar.save();

  res.status(200).json({
    status: "success",
    message: "Header updated successfully!",
    navBar,
  });
});
