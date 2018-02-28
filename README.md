# Kevin Teaches RBAC

A visual course in role-based access control.

Before we talk about anything else, we need to talk about role grants.

In RBAC lingo, a role grant is when one role obtains all the privileges of another. For example, you're probably already familiar with the idea of users and groups. If a user belongs to a group, then the user has all the privileges that the group has. In addition, the user can have its own privileges that the group doesn't get.

In role-based access control, there is really no difference between a user, a group, or any other kind of role. They are all roles, and a role is a thing that:

* Can have privileges
* Can be granted other roles

Users and groups are just conventions. Normally when you see users and groups in software, users belong to groups but groups don't belong to users. In RBAC terms, groups are granted to users but users aren't granted to groups. But RBAC doesn't actually enforce these conventions. An RBAC engine would be perfectly happy to have a group belong to a user as a user belong to a group. So, when working with RBAC, I really think it's best to forget about the different kinds of roles, and just talk about roles. Then when you are totally comfortable with RBAC, you can see users and groups again and you'll think "those are just roles".

So what really is a role grant and how does it work? The purpose of role-based access control is to, well, control access. The main way that an RBAC system does this is to answer a question of the form "Does role X have privilege Y on resource Z?" X, Y and Z are just symbols, the RBAC engine doesn't care whether role X is a user or a group, whether privilege Y is "create", "update", or "fryolate", nor whether resource Z is a server, a secret, or a waffle. Just like you can put any kind of data you want into a database, you can use role-based access control to model any kind of permission check that follows the form [ role X, privilege Y, resource Z ].

So, what is a role, actually? A role consists of the following two attributes:

* `id` We need to call it something.
* `members` A set of roles which this role has been granted to.

Id is pretty obvious and needs no further explanation, except that it should be unique. What about members? Well, if you start with a role called r_A which has members r_B and r_C, and r_B has members r_P and r_Q, and you draw them linked together by the members relationship, then it looks like a tree. Actually, it's a directed acyclic graph, because:

1. A role can be a member of more than one role.
2. There can't be any cycles in the graph; following the members of a role can't lead you back to the role itself.

What does this mean as far as access control? Keep in mind that the job of RBAC is to answer the question "Does role X have privilege Y on resource Z?"

If you are the manager of an RBAC system, you don't want to have to repeat the same privileges over and over. You don't want to say "Alice can get into the building, and Bob can get into the building, and Carol can get into the building". You want to say, "Employees can get into the building", and "Alice, Bob, and Carol are employees". That's common sense, and that's what RBAC does for you.

Let's write down the roles using a simple data file format:

```yaml
# roles.yml
- id: alice

- id: bob

- id: carol

- id: employees
  members: [ alice, bob, carol ]
```

# Appendix

# Backup material

When we were children are learning about math, we started by learning to count tangible things like fingers, apples, cars and money. Eventually, we learned that you don't actually need objects to count, you can use numbers. And even later, we learned that you don't even need actual numbers, you can represent things by symbols and in so doing you gain a lot of power. Letting go of the fingers and apples opens up new avenues of potential. So, we are not going to talk about concrete things like users and groups. We are going right to the grown-up concepts and dealing with symbols. And that way, you won't be locked into overly concrete ideas about how RBAC should work or what it should be used for. 

